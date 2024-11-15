import {Component, Inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatOption, MatSelect} from "@angular/material/select";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-add-sport-spaces-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogContent,
    MatLabel,
    MatSelect,
    MatOption,
    NgForOf,
    NgIf,
    MatError,
    TranslatePipe,
    NgClass
  ],
  templateUrl: './add-sport-spaces-dialog.component.html',
  styleUrl: './add-sport-spaces-dialog.component.css'
})
export class AddSportSpacesDialogComponent implements OnInit {
  sportSpaceForm: FormGroup;
  sportGamemodeOptions = [
    { label: 'Futbol 5', value: 'FUTBOL_5', sportId: 1 },
    { label: 'Futbol 7', value: 'FUTBOL_7', sportId: 1 },
    { label: 'Futbol 8', value: 'FUTBOL_8', sportId: 1 },
    { label: 'Futbol 11', value: 'FUTBOL_11', sportId: 1 },
    { label: 'Billar 3', value: 'BILLAR_3', sportId: 2 }
  ];
  districts = [
    'San Miguel', 'San Borja', 'San Isidro', 'Surco', 'Magdalena', 'Pueblo Libre', 'Miraflores', 'Barranco', 'La Molina',
    'Jesus_Maria', 'Lince', 'Chorrillos'
  ];
  imageUrl: string | null = null;
  gamemodes: string[] = [];
  currentLanguage: string | undefined;
  currentStep: number = 1;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddSportSpacesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService
  ) {
    this.sportSpaceForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      sportAndGamemode: [data?.sportAndGamemode || '', Validators.required],
      price: [data?.price || '', Validators.required],
      startTime: [data?.StartTime || '', Validators.required],
      endTime: [data?.endTime || '', Validators.required],
      district: [data?.district || '', Validators.required],
      description: [data?.description || '', Validators.required],
      imageUrl: [data?.imageUrl || '', Validators.required]
    });

    if (data?.id) {
      this.sportSpaceForm.addControl('id', this.fb.control(data.id));
    }

    this.updateImagePreview();
    this.onSportChange();
  }

  ngOnInit(): void {
    this.currentLanguage = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe((event: any) => {
      this.currentLanguage = event.lang;
    });
  }

  updateImagePreview(): void {
    this.imageUrl = this.sportSpaceForm.get('imageUrl')?.value;
  }

  onGamemodeChange(): void {
    this.updateAmount();
  }

  onSportChange(): void {
    const sportId = this.sportSpaceForm.get('sportId')?.value;
    if (sportId === 1) {
      this.gamemodes = ['FUTBOL_11', 'FUTBOL_8', 'FUTBOL_7', 'FUTBOL_5'];
    } else if (sportId === 2) {
      this.gamemodes = ['BILLAR_3'];
    }
    this.sportSpaceForm.get('gamemode')?.reset();
    this.updateAmount();
  }

  onSubmit(): void {
    if (this.sportSpaceForm.valid) {
      const formValue = this.sportSpaceForm.value;
      const selectedSportGamemode = formValue.sportAndGamemode;
      const selectedOption = this.sportGamemodeOptions.find(option => option.value === selectedSportGamemode);
      const userId = this.getUserIdFromLocalStorage();

      if (selectedOption) {
        const price = formValue.price;
        const maxPlayers = getMaxPlayers(selectedSportGamemode);
        const calculatedAmount = Math.floor((price / 2) / maxPlayers);

        const dataToSend = {
          ...formValue,
          gamemode: selectedSportGamemode,
          sportId: selectedOption.sportId,
          amount: calculatedAmount,
          userId: userId,
          rating: 0
        };

        delete dataToSend.sportAndGamemode;

        this.dialogRef.close(dataToSend);
      }
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  private getUserIdFromLocalStorage(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('userId');
    }
    return null;
  }

  calculateAmount(): void {
    const price = this.sportSpaceForm.get('price')?.value;
    const gamemode = this.sportSpaceForm.get('sportAndGamemode')?.value;

    const maxPlayers = getMaxPlayers(gamemode);
    const calculatedAmount = Math.floor((price / 2) / maxPlayers);

    // Establecer 'amount' calculado en el objeto de formulario
    this.sportSpaceForm.patchValue({
      amount: calculatedAmount
    });
  }

  updateAmount(): void {
    const price = this.sportSpaceForm.get('price')?.value;
    const gamemode = this.sportSpaceForm.get('gamemode')?.value;
    const maxPlayers = getMaxPlayers(gamemode);
    const calculatedAmount = Math.floor((price / 2) / maxPlayers);
    this.sportSpaceForm.get('amount')?.setValue(calculatedAmount);
  }

  nextStep(): void {
    if (this.isStepValid()) {
      if (this.currentStep < 4) {
        this.currentStep++;
      }
    }
  }

  isStepValid(): boolean {
    if (this.currentStep === 1) {
      // Paso 1: Se necesitan 'name' y 'sportAndGamemode'
      const nameValid = this.sportSpaceForm.get('name')?.valid ?? false;
      const sportAndGamemodeValid = this.sportSpaceForm.get('sportAndGamemode')?.valid ?? false;
      return nameValid && sportAndGamemodeValid;
    } else if (this.currentStep === 2) {
      // Paso 2: Se necesitan 'district', 'description' y 'price'
      const districtValid = this.sportSpaceForm.get('district')?.valid ?? false;
      const descriptionValid = this.sportSpaceForm.get('description')?.valid ?? false;
      const priceValid = this.sportSpaceForm.get('price')?.valid ?? false;
      return districtValid && descriptionValid && priceValid;
    } else if (this.currentStep === 3) {
      // Paso 3: Se necesitan 'startTime' y 'endTime'
      const startTimeValid = this.sportSpaceForm.get('startTime')?.valid ?? false;
      const endTimeValid = this.sportSpaceForm.get('endTime')?.valid ?? false;
      return startTimeValid && endTimeValid;
    } else if (this.currentStep === 4) {
      // Paso 4: Se necesita 'imageUrl'
      return this.sportSpaceForm.get('imageUrl')?.valid ?? false;
    }
    return true;
  }



  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}


export function amountValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const price = control.get('price')?.value;
    const gamemode = control.get('gamemode')?.value;
    const amount = control.get('amount')?.value;
    const maxPlayers = getMaxPlayers(gamemode);
    const calculatedAmount = Math.floor((price / 2) / maxPlayers);
    return amount > calculatedAmount ? { invalidAmount: true } : null;
  };
}

function getMaxPlayers(gamemode: string): number {
  switch (gamemode) {
    case 'FUTBOL_11':
      return 22;
    case 'FUTBOL_8':
      return 16;
    case 'FUTBOL_7':
      return 14;
    case 'FUTBOL_5':
      return 10;
    case 'BILLAR_3':
      return 3;
    default:
      return 1;
  }
}
