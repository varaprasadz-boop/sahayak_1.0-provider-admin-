import { Directive,ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appEllipsis]'
})
export class EllipsisDirective {
  @Input('appEllipsis') maxLength: number;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    const text = this.elementRef.nativeElement.innerText;
    if (text.length > this.maxLength) {
      const truncatedText = text.substring(0, this.maxLength) + '...';
      this.renderer.setProperty(this.elementRef.nativeElement, 'innerText', truncatedText);
    }
  }

}
