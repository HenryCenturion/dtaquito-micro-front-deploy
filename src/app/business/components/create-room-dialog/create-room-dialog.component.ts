import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RoomService} from "../../services/room.service";
import {MatDialogRef} from "@angular/material/dialog";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {UserService} from "../../services/user.service";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
  MatNativeDateModule,
  NativeDateAdapter
} from "@angular/material/core";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-create-room-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './create-room-dialog.component.html',
  styleUrl: './create-room-dialog.component.css',
  providers: [ {provide: DateAdapter, useClass: NativeDateAdapter}, {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}, ],
})
export class CreateRoomDialogComponent implements OnInit {
  createRoomForm: FormGroup;
  userData: any;
  minDate: Date | undefined;
  currentLanguage: string | undefined;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private userService: UserService,
    private dialogRef: MatDialogRef<CreateRoomDialogComponent>,
    private translateService: TranslateService
  ) {
    this.createRoomForm = this.fb.group({
      roomName: ['', Validators.required],
      sportSpaceId: ['', Validators.required],
      openingDate: ['', Validators.required],
      openingTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUser();
    this.minDate = new Date();
    this.currentLanguage = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe((event: any) => {
      this.currentLanguage = event.lang;
    });
  }

  getUser(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (data: any) => {
          this.userData = data;
        }
      );
    }
  }

  private getUserIdFromLocalStorage(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('userId');
    }
    return null;
  }

  onSubmit(): void {
    if (this.createRoomForm.valid) {
      const formValues = this.createRoomForm.value;
      const openingDate = new Date(formValues.openingDate);
      const [hours, minutes] = formValues.openingTime.split(':');
      openingDate.setHours(hours, minutes);

      const localDate = new Date(openingDate.getTime() - (openingDate.getTimezoneOffset() * 60000));
      const formattedDate = localDate.toLocaleString('sv-SE', { timeZone: 'UTC' }).replace('T', ' ');

      const roomData = {
        roomName: formValues.roomName,
        creatorId: this.userData.id,
        sportSpaceId: formValues.sportSpaceId,
        openingDate: formattedDate,
        day: formValues.openingTime
      };

      this.roomService.createRoom(roomData).subscribe(response => {
        this.dialogRef.close();
        window.location.reload();
      });
    }
  }

  onCancel(): void {
    document.getElementById('hs-scale-animation-modal')?.classList.add('hidden');
    this.dialogRef.close(false);
  }
}
