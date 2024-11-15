import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {TranslationService} from "../../../shared/services/translation.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-confirm-join-room-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    TranslatePipe
  ],
  templateUrl: './confirm-join-room-dialog.component.html',
  styleUrl: './confirm-join-room-dialog.component.css'
})
export class ConfirmJoinRoomDialogComponent implements OnInit {

  currentLanguage: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<ConfirmJoinRoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe((event: any) => {
      this.currentLanguage = event.lang;
    });
  }

  onCancel(): void {
    document.getElementById('hs-scale-animation-modal')?.classList.add('hidden');
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    document.getElementById('hs-scale-animation-modal')?.classList.add('hidden');
    this.dialogRef.close(true);
  }
}
