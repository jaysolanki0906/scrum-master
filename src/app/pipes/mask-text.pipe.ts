import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskText',
})
export class MaskTextPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const visibleLength = 3;
    const visiblePart = value.substring(0, visibleLength);
    const maskedPart = '*'.repeat(Math.max(value.length - visibleLength, 0));

    return visiblePart + maskedPart;
  }
}
