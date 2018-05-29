import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMapTooltip]',
})
export class MapTooltipDirective {

  private readonly defaultPositionX = 145;
  private readonly defaultPositionY = 29;

  constructor(
    private readonly el: ElementRef,
    private readonly render: Renderer2,
  ) {}

  @HostListener('mousemove', ['$event']) onChangePosition(event: MouseEvent): void {
    this.changePositionMap(event);
  }

  @HostListener('mouseenter', ['$event']) onHover(event: MouseEvent): void {
    this.changePositionMap(event);
    this.render.addClass(this.el.nativeElement.firstElementChild, 'visible');
  }

  @HostListener('mouseleave') onEndHover(): void {
    this.render.removeClass(this.el.nativeElement.firstElementChild, 'visible');
    this.resetPosition();
  }

  private changePositionMap(event: MouseEvent): void {
    if (event.layerY < 30 && this.el.nativeElement === event.target) {
      this.render.setStyle(this.el.nativeElement.firstElementChild, 'left', `${event.layerX}px`);
      this.render.setStyle(this.el.nativeElement.firstElementChild, 'top', `${event.layerY + 10}px`);
    }
  }

  private resetPosition(): void {
    this.render.setStyle(this.el.nativeElement.firstElementChild, 'left', `${this.defaultPositionX}px`);
    this.render.setStyle(this.el.nativeElement.firstElementChild, 'top', `${this.defaultPositionY + 10}px`);
  }
}
