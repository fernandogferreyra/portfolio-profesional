import { Component, inject, Input, OnChanges } from '@angular/core';

import { MotionService } from '../../services/motion.service';

export interface HomeFeaturedProject {
  id: string;
  name: string;
  meta: string;
  description: string;
  stackAriaLabel: string;
  technologies: string[];
  actions: Array<{
    id: string;
    label: string;
    primary?: boolean;
    routerLink?: string;
    url?: string;
  }>;
}

@Component({
  selector: 'app-home-project-showcase',
  standalone: false,
  templateUrl: './home-project-showcase.component.html',
  styleUrl: './home-project-showcase.component.scss',
})
export class HomeProjectShowcaseComponent implements OnChanges {
  private readonly motionService = inject(MotionService);

  @Input({ required: true }) projects: HomeFeaturedProject[] = [];
  @Input({ required: true }) sectionEyebrow = '';
  @Input({ required: true }) selectorAriaLabel = '';

  selectedProjectId: string | null = null;

  get activeProject(): HomeFeaturedProject | undefined {
    return (
      this.projects.find((project) => project.id === this.selectedProjectId) ?? this.projects[0]
    );
  }

  get activeProjectCards(): HomeFeaturedProject[] {
    const project = this.activeProject;
    return project ? [project] : [];
  }

  ngOnChanges(): void {
    if (!this.projects.length) {
      this.selectedProjectId = null;
      return;
    }

    if (!this.selectedProjectId || !this.projects.some((project) => project.id === this.selectedProjectId)) {
      this.selectedProjectId = this.projects[0].id;
    }
  }

  selectProject(projectId: string): void {
    if (projectId === this.selectedProjectId) {
      return;
    }

    this.motionService.runWithViewTransition(() => {
      this.selectedProjectId = projectId;
    });
  }

  trackByProjectId(_index: number, project: HomeFeaturedProject): string {
    return project.id;
  }
}
