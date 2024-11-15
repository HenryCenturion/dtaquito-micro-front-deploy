import {Component, OnInit} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ThemeService} from "../../../shared/services/theme.service";

@Component({
  selector: 'app-error-join-room-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    TranslatePipe
  ],
  templateUrl: './error-join-room-dialog.component.html',
  styleUrl: './error-join-room-dialog.component.css'
})
export class ErrorJoinRoomDialogComponent implements OnInit {

  currentLanguage: string | undefined;

  constructor(public dialogRef: MatDialogRef<ErrorJoinRoomDialogComponent>,
              private translateService: TranslateService) {}

  ngOnInit(): void {
    this.currentLanguage = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe((event: any) => {
      this.currentLanguage = event.lang;
    });
  }

  onClose(): void {
    document.getElementById('hs-scale-animation-modal')?.classList.add('hidden');
    this.dialogRef.close();
  }
}
