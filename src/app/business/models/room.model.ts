export class Creator {
  id: number;
  name: string;
  email: string;

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

export class SportSpace {
  id: number;
  name: string;
  sportId: number;
  imageUrl: string;
  price: number;
  district: string;
  description: string;
  startTime: string;
  endTime: string;
  gamemode: string;
  amount: number;

  constructor(id: number, name: string, sportId: number, imageUrl: string, price: number, district: string, description: string, startTime: string, endTime: string, gamemode: string, amount: number) {
    this.id = id;
    this.name = name;
    this.sportId = sportId;
    this.imageUrl = imageUrl;
    this.price = price;
    this.district = district;
    this.description = description;
    this.startTime = startTime;
    this.endTime = endTime;
    this.gamemode = gamemode;
    this.amount = amount;
  }
}

export class Room {
  id: number;
  creator: Creator;
  sportSpace: SportSpace;
  playerLists: any[];
  roomName: string;
  day: string;
  openingDate: string;
  accumulatedAmount: number;
  maxPlayers: number;
  isUserInRoom?: boolean;

  constructor(id: number, creator: Creator, sportSpace: SportSpace, playerLists: any[], roomName: string, day: string, openingDate: string, accumulatedAmount: number, maxPlayers: number) {
    this.id = id;
    this.creator = creator;
    this.sportSpace = sportSpace;
    this.playerLists = playerLists;
    this.roomName = roomName;
    this.day = day;
    this.openingDate = openingDate;
    this.accumulatedAmount = accumulatedAmount;
    this.maxPlayers = maxPlayers;
  }
}
