import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Room} from "../../models/room.model";
import {ActivatedRoute} from "@angular/router";
import {RoomService} from "../../services/room.service";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {UserService} from "../../services/user.service";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {format, toZonedTime} from "date-fns-tz";
import {WebSocketService} from "../../../shared/services/websocket.service";
import {ChatService} from "../../services/chat.service";
import {Observable} from "rxjs";
import {ThemeService} from "../../../shared/services/theme.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [
    MatCardHeader,
    MatCard,
    NgIf,
    MatCardContent,
    MatCardImage,
    MatCardTitle,
    MatCardSubtitle,
    NgForOf,
    MatFormField,
    MatInput,
    FormsModule,
    MatButton,
    MatIcon,
    NgClass,
    TranslatePipe
  ],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.css',
  providers: [WebSocketService, ChatService]
})
export class RoomDetailComponent implements OnInit {
  @ViewChild('lastMessage') lastMessage: ElementRef | undefined;

  room: Room | undefined;
  players: any[] = [];
  messages: any[] = [];
  newMessage: string = '';
  userData: any;
  showEmojiPicker: boolean = false;
  detailsExpanded: boolean = false;
  emojis: string[] = ['😀', '😂', '😍', '😢', '😡', '👍', '🎉', '❤️'];
  userDataMessage: any;
  isSidebarOpen: boolean = true;
  isSidebarVisible: boolean = true;
  currentLanguage: string | undefined;
  isDarkMode: boolean = false;
  isSmallScreen: boolean = window.innerWidth <= 800;


  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private userService: UserService,
    private chatService: ChatService,
    private themeService: ThemeService,
    private translateService: TranslateService
  ) {
    window.addEventListener('resize', this.checkWindowSize.bind(this));
  }


  ngOnInit(): void {
    this.setCurrentTheme();
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
    this.currentLanguage = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe((event: any) => {
      this.currentLanguage = event.lang;
    });
    this.checkWindowSize();
    this.getUser();
    this.getRoomDetails();
    this.getPlayerList();
    this.getRoomChat();
    this.subscribeToMessages();
  }

  scrollToBottom(): void {
    if (this.lastMessage) {
      setTimeout(() => {
        this.lastMessage?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
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

  checkWindowSize() {
    this.isSidebarVisible = window.innerWidth >= 1024;
    this.isSmallScreen = window.innerWidth <= 800;
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

  getRoomDetails(): void {
    const roomId = this.route.snapshot.paramMap.get('id');
    if (roomId) {
      this.roomService.getRoomById(+roomId).subscribe(
        (data: Room) => {
          this.room = data;
          this.setMaxPlayers(this.room);
        }
      );
    }
  }

  getRoomChat(): void {
    const roomId = this.route.snapshot.paramMap.get('id');
    if (roomId) {
      this.roomService.getRoomChat(+roomId).subscribe(
        (data: any[]) => {
          data.forEach(message => {
            message.createdAt = new Date(message.createdAt);
          });
          data.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
          this.messages = [];
          data.forEach(message => {
            this.userService.getUserById(message.userId).subscribe(
              (user: any) => {
                this.messages.push({
                  content: message.content,
                  user: user,
                  createdAt: message.createdAt
                });
                this.messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
                this.scrollToBottom();
              }
            );
          });
        }
      );
    }
  }


  getPlayerList(): void {
    const roomId = this.route.snapshot.paramMap.get('id');
    if (roomId) {
      this.roomService.getPlayerList(+roomId).subscribe(
        (playerIds: any[]) => {
          this.players = [];
          playerIds.forEach(player => {
            const playerId = player.userId;
            this.userService.getUserById(playerId).subscribe(
              (user: any) => {
                this.players.push(user);
              }
            );
          });
        }
      );
    }
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

  getSportGamemode(gamemode: string): string {
    switch (gamemode) {
      case "FUTBOL_5":
        return 'Futbol 5';
      case "FUTBOL_7":
        return 'Futbol 7';
      case "FUTBOL_8":
        return 'Futbol 8';
      case "FUTBOL_11":
        return 'Futbol 11';
      case "BILLAR_3":
        return 'Billar';
      default:
        return 'Unknown Gamemode';
    }
  }

  setMaxPlayers(room: Room): number {
    switch (room.sportSpace.gamemode) {
      case "FUTBOL_5":
        return room.maxPlayers = 10;
      case "FUTBOL_7":
        return room.maxPlayers = 14;
      case "FUTBOL_8":
        return room.maxPlayers = 16;
      case "FUTBOL_11":
        return room.maxPlayers = 22;
      case "BILLAR_3":
        return room.maxPlayers = 3;
      default:
        return 0;
    }
  }

  formatDate1(dateString: string): string {
    const timeZone = 'Etc/GMT-0';
    const zonedDate = toZonedTime(new Date(dateString), timeZone);
    return format(zonedDate, 'dd/MM/yyyy, HH:mm', { timeZone });
  }

  formatDate2(dateString: string): string {
    const timeZone = 'Etc/GMT+10';
    const zonedDate = toZonedTime(new Date(dateString), timeZone);
    return format(zonedDate, 'dd/MM/yyyy, HH:mm', { timeZone });
  }

  sendMessage(event: Event): void {
    event.stopPropagation();
    const roomId = this.route.snapshot.paramMap.get('id');
    if (roomId && this.newMessage.trim() && this.userData) {
      this.chatService.sendMessage(+roomId, this.newMessage, this.userData.id).subscribe(
        (response: any) => {
          this.messages.push({
            content: response.content,
            user: this.userData,
            createdAt: new Date(response.createdAt)
          });
          this.newMessage = '';
          this.scrollToBottom();
        },
        (error: any) => {
          console.error('Error sending message', error);
        }
      );
    }
  }

  subscribeToMessages(): void {
    this.chatService.receiveMessages().subscribe(
      (message: any) => {
        if (message.author !== this.userData.id) {
          this.userService.getUserById(message.author).subscribe(
            (user: any) => {
              this.messages.push({
                content: message.message,
                user: user,
                createdAt: new Date()
              });
              setTimeout(() => this.scrollToBottom(), 0);
            },
            (error: any) => {
              console.error('Error fetching user', error);
            }
          );
        }
      },
      (error: any) => {
        console.error('Error receiving message', error);
      }
    );
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(emoji: string) {
    this.newMessage += emoji;
    this.showEmojiPicker = false;
  }

  toggleDetails(): void {
    this.detailsExpanded = !this.detailsExpanded;
  }
}
