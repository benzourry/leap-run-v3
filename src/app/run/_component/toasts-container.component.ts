import { ChangeDetectionStrategy, Component, TemplateRef, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../_shared/service/toast-service';

@Component({
  selector: 'app-toasts',
  template: `
    @for (toast of toasts(); track $index) {
      <ngb-toast
        style="overflow:hidden"
        [class]="toast.classname" class="mx-auto mb-1"
        [autohide]="true"
        [delay]="toast.delay || 4000"
        (hidden)="removeToast(toast)"    
        (click)="removeToast(toast)">
        @if (isTemplate(toast)) {
          <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
        } @else {
          <div [innerHtml]="toast.textOrTpl"></div>
        }

        <!-- Countdown Progress Bar -->
        <div class="toast-progress" [style.animation-duration.ms]="toast.delay || 4000"
        [class.bg-black]="!toast.classname"></div>
      </ngb-toast>
    }
  `,
  host: { '[class.ngb-toasts]': 'true' },
  imports: [NgbToast, NgTemplateOutlet],
  styles: [`
    ::ng-deep ngb-toast {
      position: relative;
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      background-color: white; // or any color you prefer
      animation-name: toastProgress;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
      animation-play-state: running;
      animation-delay: 0s;
      animation-iteration-count: 1;
      width: 100%; 
    }
    .bg-black {
      background-color: black;
    }

    @keyframes toastProgress {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush // Ensures better performance in zoneless mode
})
export class ToastsContainer {
  private toastService = inject(ToastService); // Use signal for state management
  toasts = computed(() => this.toastService.toasts()); // Derived state for toasts

  isTemplate(toast: any): boolean {
    return toast instanceof TemplateRef;
  }

  removeToast(toast: any): void {
    this.toastService.remove(toast);
  }
}