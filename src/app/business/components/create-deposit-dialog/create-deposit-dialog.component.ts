import {Component, OnInit} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {DepositService} from "../../services/deposit.service";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-create-deposit-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    TranslatePipe
  ],
  templateUrl: './create-deposit-dialog.component.html',
  styleUrl: './create-deposit-dialog.component.css'
})
export class CreateDepositDialogComponent implements OnInit {
  depositForm: FormGroup;
  currentLanguage: string | undefined;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateDepositDialogComponent>,
    private depositService: DepositService,
    private translateService: TranslateService
  ) {
    this.depositForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.currentLanguage = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe((event: any) => {
      this.currentLanguage = event.lang;
    });
  }

  onDeposit(): void {
    if (this.depositForm.valid) {
      const amount = this.depositForm.get('amount')?.value;
      this.depositService.createDeposit(amount).subscribe(
        (data: string) => {
          console.log('Enlace de pago:', data);

          // Extraer el enlace de la respuesta de texto plano
          const match = data.match(/paymentLink=(https?:\/\/[^\s]+)/);
          if (match && match[1]) {
            const paymentLink = match[1];
            console.log('Enlace de pago extraído:', paymentLink);

            // Abrir la URL en una ventana emergente
            const paymentWindow = window.open(paymentLink, 'Payment', 'width=800,height=800');
            if (paymentWindow) {
              const interval = setInterval(() => {
                if (paymentWindow.closed) {
                  clearInterval(interval);
                  location.reload(); // Recargar la página cuando se cierre la ventana de pago
                }
              }, 1000);
            }
          } else {
            console.error('No se pudo extraer el enlace de pago de la respuesta.');
          }
        },
        (error) => {
          console.error('Error al crear el depósito:', error);
        }
      );
    }
  }



  onCancel(): void {
    this.dialogRef.close();
  }
}
