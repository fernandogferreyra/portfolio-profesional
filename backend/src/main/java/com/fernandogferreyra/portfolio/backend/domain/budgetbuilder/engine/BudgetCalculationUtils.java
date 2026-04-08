package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Locale;

public final class BudgetCalculationUtils {

    private static final int MONEY_SCALE = 2;

    private BudgetCalculationUtils() {
    }

    public static BigDecimal safe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value.max(BigDecimal.ZERO);
    }

    public static BigDecimal roundCurrency(BigDecimal value) {
        return safe(value).setScale(MONEY_SCALE, RoundingMode.HALF_UP);
    }

    public static BigDecimal roundTechnicalHours(
        BigDecimal value,
        ConfigurationSnapshot.TechnicalRounding strategy
    ) {
        BigDecimal safeValue = safe(value);
        if (strategy == ConfigurationSnapshot.TechnicalRounding.ROUND_NEAREST_HOUR) {
            return BigDecimal.valueOf(Math.round(safeValue.doubleValue())).setScale(MONEY_SCALE, RoundingMode.HALF_UP);
        }
        return roundCurrency(safeValue);
    }

    public static BigDecimal roundCommercialValue(
        BigDecimal value,
        ConfigurationSnapshot.CommercialRounding strategy
    ) {
        BigDecimal safeValue = safe(value);
        return switch (strategy) {
            case ROUND_UP_INTEGER -> BigDecimal.valueOf(Math.ceil(safeValue.doubleValue()))
                .setScale(MONEY_SCALE, RoundingMode.HALF_UP);
            case ROUND_2_DECIMALS -> roundCurrency(safeValue);
            case NONE -> safeValue.setScale(MONEY_SCALE, RoundingMode.HALF_UP);
        };
    }

    public static BigDecimal clampMinimum(BigDecimal value, BigDecimal minimum) {
        return safe(value).max(safe(minimum));
    }

    public static String normalizeProjectKey(String rawValue) {
        return normalize(rawValue, false, '_');
    }

    public static String normalizeStackKey(String rawValue) {
        return normalize(rawValue, false, '_');
    }

    public static String normalizeModuleKey(String rawValue) {
        return normalize(rawValue, true, '_');
    }

    public static String normalizeSurchargeKey(String rawValue) {
        return normalize(rawValue, false, '-');
    }

    public static String normalizePlanKey(String rawValue) {
        return normalize(rawValue, false, '-');
    }

    private static String normalize(String rawValue, boolean uppercase, char separator) {
        if (rawValue == null) {
            return "";
        }

        String normalized = rawValue.trim()
            .replace('-', separator)
            .replace(' ', separator);

        return uppercase
            ? normalized.toUpperCase(Locale.ROOT)
            : normalized.toLowerCase(Locale.ROOT);
    }
}
