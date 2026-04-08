import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';

type RevealAxis = 'up' | 'left' | 'right';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: false,
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;
  private axis: RevealAxis = 'up';
  private setupFrameId?: number;
  private revealFrameId?: number;

  @Input('appRevealOnScroll')
  set revealAxis(value: RevealAxis | '' | null | undefined) {
    this.axis = value === 'left' || value === 'right' ? value : 'up';
  }

  @Input() revealDelay = 0;
  @Input() revealDistance = 18;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    const element = this.elementRef.nativeElement;

    this.renderer.addClass(element, 'reveal-on-scroll');
    this.renderer.setAttribute(element, 'data-reveal-axis', this.axis);
    this.renderer.setStyle(element, '--reveal-delay', `${Math.max(0, this.revealDelay)}ms`);

    if (this.axis === 'left') {
      this.renderer.setStyle(element, '--reveal-x', `-${Math.max(0, this.revealDistance)}px`);
      this.renderer.setStyle(element, '--reveal-y', '0px');
    } else if (this.axis === 'right') {
      this.renderer.setStyle(element, '--reveal-x', `${Math.max(0, this.revealDistance)}px`);
      this.renderer.setStyle(element, '--reveal-y', '0px');
    } else {
      this.renderer.setStyle(element, '--reveal-x', '0px');
      this.renderer.setStyle(element, '--reveal-y', `${Math.max(0, this.revealDistance)}px`);
    }

    if (this.prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(element, 'is-visible');
      return;
    }

    // Give the browser one paint with the hidden state before observing,
    // otherwise above-the-fold elements can appear without an actual transition.
    this.setupFrameId = globalThis.requestAnimationFrame(() => {
      this.setupFrameId = globalThis.requestAnimationFrame(() => {
        this.observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                this.revealFrameId = globalThis.requestAnimationFrame(() => {
                  this.renderer.addClass(element, 'is-visible');
                });
                this.observer?.disconnect();
                this.observer = undefined;
                break;
              }
            }
          },
          {
            threshold: 0.08,
            rootMargin: '0px 0px -6% 0px',
          },
        );

        this.observer.observe(element);
      });
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.setupFrameId !== undefined) {
      globalThis.cancelAnimationFrame(this.setupFrameId);
    }
    if (this.revealFrameId !== undefined) {
      globalThis.cancelAnimationFrame(this.revealFrameId);
    }
  }

  private prefersReducedMotion(): boolean {
    return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }
}
