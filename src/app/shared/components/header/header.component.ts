import {Component, OnInit, ViewChild} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {AuthService} from "../../../iam/services/auth.service";
import {User} from "../../../business/models/user.model";
import {UserService} from "../../../business/services/user.service";
import {DepositService} from "../../../business/services/deposit.service";
import {MatDialog} from "@angular/material/dialog";
import {
  CreateDepositDialogComponent
} from "../../../business/components/create-deposit-dialog/create-deposit-dialog.component";
import {MatSidenav} from "@angular/material/sidenav";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {ThemeService} from "../../services/theme.service";
import {TranslationService} from "../../services/translation.service";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbar,
    MatIcon,
    MatIconButton,
    NgIf,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    TranslatePipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {

  language: string = 'en';
  isDarkMode = false;
  currentUser: User | null = null;
  userData: any | undefined;
  dataOwner: boolean = false;
  dataPlayer: boolean = false;
  userCredits: number = 0;

  constructor(private authService: AuthService,
              private userService: UserService,
              public dialog: MatDialog,
              private themeService: ThemeService,
              private translationService: TranslationService) {}

  ngOnInit(): void {

    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
      this.applyTheme();
    });

    this.language = localStorage.getItem('language') || 'en';

    // Verifica si hay un token en el localStorage al iniciar
    const token = this.authService.getToken();
    if (token && this.authService.isAuthenticated()) {
      this.getUser(); // Intenta obtener el usuario
    }

    // Suscríbete a los cambios del usuario
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.getUser();
      } else {
        this.userData = null;
        this.dataOwner = false;
        this.dataPlayer = false;
        this.userCredits = 0;
      }
    });
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  changeLanguage(): void {
    this.language = this.language === 'en' ? 'es' : 'en';
    localStorage.setItem('language', this.language);
    this.translationService.setLanguage(this.language);
  }


  applyTheme(): void {
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      if (typeof document !== 'undefined') {
        if (isDarkMode) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      }
    });
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  getUser(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (data: any) => {
          this.userData = data;
          this.userCredits = this.userData.credits;
          if (this.userData.roleType === 'P') {
            this.dataOwner = true;
          }else{
            this.dataPlayer = true;
          }
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


  reloadCredits(): void {
    const dialogRef = this.dialog.open(CreateDepositDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
