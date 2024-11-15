import {Component, HostBinding, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage, TitleCasePipe} from "@angular/common";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardModule,
  MatCardTitle
} from "@angular/material/card";
import {SportSpace} from "../../models/sport-space.model";
import {SportSpaceService} from "../../services/sport-space.service";
import {MatButtonModule} from "@angular/material/button";
import {UserService} from "../../services/user.service";
import {SubscriptionService} from "../../services/subscription.service";
import {MatDialog} from "@angular/material/dialog";
import {AddSportSpacesDialogComponent} from "../../components/add-sport-spaces-dialog/add-sport-spaces-dialog.component";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import confetti from 'canvas-confetti';
import {ThemeService} from "../../../shared/services/theme.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {classNames} from "@angular/cdk/schematics";

@Component({
  selector: 'app-sport-spaces',
  standalone: true,
  imports: [
    NgForOf,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatCardImage,
    NgOptimizedImage,
    MatCardModule,
    MatButtonModule,
    NgIf,
    MatIcon,
    MatFormField,
    MatSelect,
    FormsModule,
    MatOption,
    MatInput,
    MatLabel,
    TitleCasePipe,
    NgClass,
    TranslatePipe
  ],
  templateUrl: './sport-spaces.component.html',
  styleUrl: './sport-spaces.component.css'
})
export class SportSpacesComponent implements OnInit {
  sportSpaces: SportSpace[] = [];
  filteredSportSpaces: SportSpace[] = [];
  userData: any;
  userSubscriptionData: any;
  dataOwner = false;
  canAddMoreSportSpaces = false;
  maxSportSpaces = 0;
  isFilterMenuOpen = false;
  filter = {
    sportId: 0,
    gamemode: '',
    district: '',
    minPrice: 0,
    maxPrice: 0
  };
  sports = [
    { id: 1, name: 'Football' },
    { id: 2, name: 'Billiards' }
  ];
  districts = [
    'San_Miguel', 'San_Borja', 'San_Isidro', 'Surco', 'Magdalena', 'Pueblo_Libre', 'Miraflores', 'Barranco', 'La_Molina',
    'Jesus_Maria', 'Lince', 'Chorrillos'
  ];
  gamemodes: string[] = [];
  cooldown = false;
  lastShapeIndex = 0;
  isDarkMode: boolean = false;
  currentLanguage: string | undefined;

  constructor(
    private sportSpaceService: SportSpaceService,
    private userService: UserService,
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.setCurrentTheme();
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
    this.currentLanguage = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe((event: any) => {
      this.currentLanguage = event.lang;
    });
    this.loadSportSpaces();
    this.updateGamemodes();
  }

  setCurrentTheme(): void {
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      if (typeof document !== 'undefined') {
        if (isDarkMode) {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
      }
    });
  }

  loadSportSpaces(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (data: any) => {
          this.userData = data;
          if (this.userData.roleType === 'P') {
            this.dataOwner = true;
            this.sportSpaceService.getSportSpacesByUserId(userId).subscribe((data: SportSpace[]) => {
              this.sportSpaces = data;
              this.filteredSportSpaces = data;
              this.updateCanAddMoreSportSpaces(userId);
            });
          } else {
            this.sportSpaceService.getAllSportSpaces().subscribe((data: SportSpace[]) => {
              this.sportSpaces = data;
              this.filteredSportSpaces = data;
              console.log('Sport spaces:', data);
            });
          }
        },
        (error: any) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }

  private updateCanAddMoreSportSpaces(userId: string): void {
    this.subscriptionService.getSubscriptionbyUserId(userId).subscribe(
      (data: any) => {
        this.userSubscriptionData = data;
        this.maxSportSpaces = this.getMaxSportSpaces(data.planType);
        this.canAddMoreSportSpaces = this.sportSpaces.length < this.maxSportSpaces;
      }
    );
  }

  private getUserIdFromLocalStorage(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('userId');
    }
    return null;
  }

  getDisplayDistricts(): string[] {
    return this.districts.map(district => district.replace(/_/g, ' '));
  }

  private getMaxSportSpaces(planType: string): number {
    switch (planType) {
      case 'bronce':
        return 1;
      case 'plata':
        return 2;
      case 'oro':
        return 3;
      case 'free':
        return 0;
      default:
        return 0;
    }
  }

  addSportSpace(): void {
    const dialogRef = this.dialog.open(AddSportSpacesDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sportSpaceService.addSportSpace(result).subscribe(() => {
          this.loadSportSpaces();
        });
      }
    });
  }

  editSportSpace(sportSpace: SportSpace): void {
    const dialogRef = this.dialog.open(AddSportSpacesDialogComponent, {
      data: sportSpace
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sportSpaceService.updateSportSpace(result).subscribe(() => {
          this.loadSportSpaces();
        });
      }
    });
  }

  applyFilters(): void {
    if (this.filter.sportId === 2) {
      this.filter.gamemode = 'BILLAR_3';
    }
    this.updateGamemodes();
    this.filteredSportSpaces = this.sportSpaces.filter(sportSpace => {
      return (!this.filter.sportId || sportSpace.sportId === this.filter.sportId) &&
        (!this.filter.gamemode || sportSpace.gamemode === this.filter.gamemode) &&
        (!this.filter.district || sportSpace.district === this.filter.district) &&
        (!this.filter.minPrice || sportSpace.price >= this.filter.minPrice) &&
        (!this.filter.maxPrice || sportSpace.price <= this.filter.maxPrice);
    });
  }

  clearFilters(): void {
    this.filter = {
      sportId: 0,
      gamemode: '',
      district: '',
      minPrice: 0,
      maxPrice: 0
    };
    this.applyFilters();
  }

  updateGamemodes(): void {
    if (this.filter.sportId === 1) {
      this.gamemodes = ['FUTBOL_11', 'FUTBOL_8', 'FUTBOL_7', 'FUTBOL_5'];
    } else if (this.filter.sportId === 2) {
      this.gamemodes = ['BILLAR_3'];
    } else {
      this.gamemodes = [];
    }
  }

  transformGamemode(gamemode: string): string {
    return gamemode.replace('_', ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }

  celebrate() {
    let scalar = 3;
    let shapes = [
      confetti.shapeFromText({ text: '⚽', scalar }),
      confetti.shapeFromText({ text: '🎱', scalar })
    ];

    if (this.cooldown) {
      return;
    }

    this.cooldown = true;
    const duration = 6000;

    let randomShape = shapes[this.lastShapeIndex];
    this.lastShapeIndex = (this.lastShapeIndex + 1) % shapes.length;

    confetti({
      particleCount: 80,
      spread: 160,
      origin: { y: 0.37 },
      shapes: [randomShape],
      scalar
    });

    setTimeout(() => {
      confetti.reset();
      this.cooldown = false;
    }, duration);
  }

  toggleFilterMenu() {
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
  }

  getSportName(sportId: number): string {
    switch (sportId) {
      case 1:
        return 'Futbol';
      case 2:
        return 'Billar';
      default:
        return 'Unknown Sport';
    }
  }
}
