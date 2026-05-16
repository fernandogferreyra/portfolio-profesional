package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.domain.documents.entity.DocumentEntity;
import com.fernandogferreyra.portfolio.backend.domain.documents.model.DocumentDownload;
import com.fernandogferreyra.portfolio.backend.domain.skills.entity.SkillCategoryEntity;
import com.fernandogferreyra.portfolio.backend.domain.skills.entity.SkillEntity;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCategoryCreateRequest;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCategoryResponse;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCategoryUpdateRequest;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCreateRequest;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillResponse;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillUpdateRequest;
import com.fernandogferreyra.portfolio.backend.mapper.skills.SkillCatalogMapper;
import com.fernandogferreyra.portfolio.backend.repository.documents.DocumentRepository;
import com.fernandogferreyra.portfolio.backend.repository.skills.SkillCategoryRepository;
import com.fernandogferreyra.portfolio.backend.repository.skills.SkillRepository;
import com.fernandogferreyra.portfolio.backend.service.SkillCatalogService;
import com.fernandogferreyra.portfolio.backend.service.StorageService;
import java.io.IOException;
import java.text.Normalizer;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class SkillCatalogServiceImpl implements SkillCatalogService {

    private static final String DEFAULT_ICON = "frontend";
    private static final String DEFAULT_LEVEL = "basic";
    private static final List<String> ALLOWED_LEVELS = List.of("basic", "intermediate", "advanced");

    private final SkillCatalogMapper skillCatalogMapper;
    private final DocumentRepository documentRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final SkillRepository skillRepository;
    private final StorageService storageService;

    @Override
    @Transactional(readOnly = true)
    public List<SkillCategoryResponse> getPublicCatalog(String language) {
        String normalizedLanguage = normalizeLanguage(language);
        List<SkillCategoryEntity> categories = skillCategoryRepository.findByLanguageAndPublishedTrueOrderByDisplayOrderAscLabelAsc(normalizedLanguage);
        List<SkillEntity> skills = skillRepository.findByLanguageAndPublishedTrueOrderByDisplayOrderAscNameAsc(normalizedLanguage)
            .stream()
            .filter(skill -> skill.getCategory() != null && skill.getCategory().isPublished())
            .toList();

        return buildCatalog(categories, skills, false);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillCategoryResponse> getAdminCatalog(String language) {
        String normalizedLanguage = normalizeLanguage(language);
        List<SkillCategoryEntity> categories = skillCategoryRepository.findByLanguageOrderByDisplayOrderAscLabelAsc(normalizedLanguage);
        List<SkillEntity> skills = skillRepository.findByLanguageOrderByDisplayOrderAscNameAsc(normalizedLanguage);

        return buildCatalog(categories, skills, true);
    }

    @Override
    @Transactional
    public SkillResponse createSkill(SkillCreateRequest request) {
        String language = normalizeLanguage(request.language());
        SkillEntity entity = new SkillEntity();
        entity.setLanguage(language);
        entity.setName(normalizeText(request.name(), "Skill name is required"));
        entity.setSlug(resolveAvailableSlug(language, normalizeSlug(request.slug(), entity.getName()), true));
        entity.setDescription(normalizeNullableText(request.description()));
        entity.setCategory(resolveCategory(language, request.categoryId()));
        entity.setIcon(normalizeIcon(request.icon()));
        entity.setIconDocumentId(resolveIconDocumentId(request.iconDocumentId()));
        entity.setAccentColor(normalizeAccentColor(request.accentColor()));
        entity.setLevel(normalizeLevel(request.level()));
        entity.setTagsJson(skillCatalogMapper.writeTags(request.tags()));
        entity.setShowLevel(request.showLevel() == null || request.showLevel());
        entity.setPublished(Boolean.TRUE.equals(request.published()));
        entity.setDisplayOrder(request.displayOrder() == null ? resolveNextSkillOrder(language) : request.displayOrder());

        return skillCatalogMapper.toSkillResponse(skillRepository.save(entity));
    }

    @Override
    @Transactional
    public SkillResponse updateSkill(UUID id, SkillUpdateRequest request) {
        SkillEntity entity = skillRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found"));

        String desiredSlug = normalizeSlug(request.slug(), request.name());
        if (!entity.getSlug().equals(desiredSlug)) {
            entity.setSlug(resolveAvailableSlug(entity.getLanguage(), desiredSlug, false));
        }
        entity.setName(normalizeText(request.name(), "Skill name is required"));
        entity.setDescription(normalizeNullableText(request.description()));
        entity.setCategory(resolveCategory(entity.getLanguage(), request.categoryId()));
        entity.setIcon(normalizeIcon(request.icon()));
        entity.setIconDocumentId(resolveIconDocumentId(request.iconDocumentId()));
        entity.setAccentColor(normalizeAccentColor(request.accentColor()));
        entity.setLevel(normalizeLevel(request.level()));
        entity.setTagsJson(skillCatalogMapper.writeTags(request.tags()));
        entity.setShowLevel(request.showLevel());
        entity.setPublished(request.published());
        entity.setDisplayOrder(request.displayOrder());

        return skillCatalogMapper.toSkillResponse(skillRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteSkill(UUID id) {
        SkillEntity entity = skillRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found"));

        skillRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentDownload downloadSkillIcon(UUID id) {
        SkillEntity skill = skillRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found"));

        if (skill.getIconDocumentId() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill has no linked icon");
        }

        DocumentEntity document = documentRepository.findById(skill.getIconDocumentId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Linked skill icon not found"));

        try {
            return new DocumentDownload(
                storageService.load(document.getStoragePath()),
                document.getOriginalFilename(),
                document.getContentType(),
                document.getSizeBytes());
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Linked skill icon file not found");
        }
    }

    @Override
    @Transactional
    public SkillCategoryResponse createCategory(SkillCategoryCreateRequest request) {
        String language = normalizeLanguage(request.language());
        SkillCategoryEntity pendingCategory = resolvePendingCategory(language, request.label());
        if (pendingCategory != null) {
            return skillCatalogMapper.toCategoryResponse(pendingCategory, List.of());
        }

        SkillCategoryEntity entity = new SkillCategoryEntity();
        entity.setLanguage(language);
        entity.setLabel(normalizeText(request.label(), "Category label is required"));
        entity.setSlug(resolveAvailableCategorySlug(language, normalizeSlug(request.slug(), entity.getLabel()), true));
        entity.setDescription(normalizeNullableText(request.description()));
        entity.setPublished(request.published() == null || request.published());
        entity.setDisplayOrder(request.displayOrder() == null ? resolveNextCategoryOrder(language) : request.displayOrder());

        return skillCatalogMapper.toCategoryResponse(skillCategoryRepository.save(entity), List.of());
    }

    @Override
    @Transactional
    public SkillCategoryResponse updateCategory(UUID id, SkillCategoryUpdateRequest request) {
        SkillCategoryEntity entity = skillCategoryRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill category not found"));

        String desiredSlug = normalizeSlug(request.slug(), request.label());
        if (!entity.getSlug().equals(desiredSlug)) {
            entity.setSlug(resolveAvailableCategorySlug(entity.getLanguage(), desiredSlug, false));
        }
        entity.setLabel(normalizeText(request.label(), "Category label is required"));
        entity.setDescription(normalizeNullableText(request.description()));
        entity.setPublished(request.published());
        entity.setDisplayOrder(request.displayOrder());

        SkillCategoryEntity saved = skillCategoryRepository.save(entity);
        List<SkillResponse> skills = skillRepository.findByCategory(saved).stream()
            .sorted(Comparator.comparingInt(SkillEntity::getDisplayOrder).thenComparing(SkillEntity::getName))
            .map(skillCatalogMapper::toSkillResponse)
            .toList();
        return skillCatalogMapper.toCategoryResponse(saved, skills);
    }

    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        SkillCategoryEntity category = skillCategoryRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill category not found"));

        SkillCategoryEntity fallback = ensureFallbackCategory(category.getLanguage());
        if (category.getId().equals(fallback.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fallback category cannot be deleted");
        }

        List<SkillEntity> skills = skillRepository.findByCategory(category);
        skills.forEach(skill -> skill.setCategory(fallback));
        skillRepository.saveAll(skills);
        skillCategoryRepository.delete(category);
    }

    private List<SkillCategoryResponse> buildCatalog(List<SkillCategoryEntity> categories, List<SkillEntity> skills, boolean includeEmptyCategories) {
        Map<UUID, List<SkillResponse>> skillsByCategory = skills.stream()
            .filter(skill -> skill.getCategory() != null)
            .collect(Collectors.groupingBy(
                skill -> skill.getCategory().getId(),
                Collectors.mapping(skillCatalogMapper::toSkillResponse, Collectors.toList())));

        return categories.stream()
            .map(category -> skillCatalogMapper.toCategoryResponse(category, skillsByCategory.getOrDefault(category.getId(), List.of())))
            .filter(category -> includeEmptyCategories || !category.skills().isEmpty())
            .toList();
    }

    private SkillCategoryEntity resolveCategory(String language, UUID categoryId) {
        if (categoryId == null) {
            return ensureFallbackCategory(language);
        }

        SkillCategoryEntity category = skillCategoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Skill category not found"));
        if (!category.getLanguage().equals(language)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Skill category language mismatch");
        }
        return category;
    }

    private SkillCategoryEntity ensureFallbackCategory(String language) {
        String fallbackSlug = "es".equals(language) ? "otras" : "other";
        return skillCategoryRepository.findByLanguageAndSlug(language, fallbackSlug)
            .orElseGet(() -> {
                SkillCategoryEntity fallback = new SkillCategoryEntity();
                fallback.setLanguage(language);
                fallback.setSlug(fallbackSlug);
                fallback.setLabel("es".equals(language) ? "Otras" : "Other");
                fallback.setDescription("es".equals(language) ? "Skills sin categoria activa." : "Skills without an active category.");
                fallback.setPublished(true);
                fallback.setDisplayOrder(999);
                return skillCategoryRepository.save(fallback);
            });
    }

    private String normalizeLanguage(String language) {
        String normalized = language == null ? "es" : language.trim().toLowerCase(Locale.ROOT);
        return "en".equals(normalized) ? "en" : "es";
    }

    private String normalizeText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }

    private String normalizeNullableText(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeSlug(String slug, String fallback) {
        String source = slug == null || slug.isBlank() ? fallback : slug;
        String normalized = Normalizer.normalize(source, Normalizer.Form.NFD)
            .replaceAll("\\p{M}", "")
            .toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("(^-|-$)", "");
        return normalized.isBlank() ? "item" : normalized;
    }

    private String normalizeIcon(String icon) {
        if (icon == null || icon.isBlank()) {
            return DEFAULT_ICON;
        }
        return icon.trim();
    }

    private UUID resolveIconDocumentId(UUID iconDocumentId) {
        if (iconDocumentId == null) {
            return null;
        }

        DocumentEntity document = documentRepository.findById(iconDocumentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Linked skill icon not found"));
        String contentType = document.getContentType() == null ? "" : document.getContentType().toLowerCase(Locale.ROOT);
        if (!contentType.startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Skill icon must be an image");
        }
        return iconDocumentId;
    }

    private String normalizeAccentColor(String accentColor) {
        if (accentColor == null || accentColor.isBlank()) {
            return "#2dd4bf";
        }

        String normalized = accentColor.trim();
        if (!normalized.matches("#[0-9a-fA-F]{6}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid skill accent color");
        }
        return normalized;
    }

    private String normalizeLevel(String level) {
        String normalized = level == null || level.isBlank() ? DEFAULT_LEVEL : level.trim().toLowerCase(Locale.ROOT);
        if (!ALLOWED_LEVELS.contains(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid skill level");
        }
        return normalized;
    }

    private String resolveAvailableSlug(String language, String baseSlug, boolean includeBase) {
        String slug = baseSlug;
        int suffix = 2;
        while (skillRepository.existsByLanguageAndSlug(language, slug)) {
            if (!includeBase && slug.equals(baseSlug)) {
                slug = baseSlug + "-" + suffix;
            } else {
                slug = baseSlug + "-" + suffix;
            }
            suffix++;
        }
        return slug;
    }

    private String resolveAvailableCategorySlug(String language, String baseSlug, boolean includeBase) {
        String slug = baseSlug;
        int suffix = 2;
        while (skillCategoryRepository.existsByLanguageAndSlug(language, slug)) {
            if (!includeBase && slug.equals(baseSlug)) {
                slug = baseSlug + "-" + suffix;
            } else {
                slug = baseSlug + "-" + suffix;
            }
            suffix++;
        }
        return slug;
    }

    private int resolveNextSkillOrder(String language) {
        return skillRepository.findByLanguageOrderByDisplayOrderAscNameAsc(language).stream()
            .mapToInt(SkillEntity::getDisplayOrder)
            .max()
            .orElse(0) + 10;
    }

    private int resolveNextCategoryOrder(String language) {
        return skillCategoryRepository.findByLanguageOrderByDisplayOrderAscLabelAsc(language).stream()
            .mapToInt(SkillCategoryEntity::getDisplayOrder)
            .max()
            .orElse(0) + 10;
    }

    private SkillCategoryEntity resolvePendingCategory(String language, String label) {
        String normalizedLabel = label == null ? "" : label.trim().toLowerCase(Locale.ROOT);
        boolean isDefaultDraftLabel = ("es".equals(language) && "nueva categoria".equals(normalizedLabel))
            || ("en".equals(language) && "new category".equals(normalizedLabel));
        if (!isDefaultDraftLabel) {
            return null;
        }

        return skillCategoryRepository.findByLanguageOrderByDisplayOrderAscLabelAsc(language)
            .stream()
            .filter(category -> category.getLabel().trim().equalsIgnoreCase(label.trim()))
            .filter(category -> skillRepository.findByCategory(category).isEmpty())
            .findFirst()
            .orElse(null);
    }
}
