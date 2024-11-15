export class SportSpace {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  ownerId: number;
  sportId: number;
  price: number;
  district: string;
  StartTime: string;
  endTime: string;
  amount: number;
  gamemode: string;

  constructor(id: number, name: string, imageUrl: string, description: string, ownerId: number, sportId: number, price: number, district: string, StartTime: string, endTime: string, amount: number, gamemode: string) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.description = description;
    this.ownerId = ownerId;
    this.sportId = sportId;
    this.price = price;
    this.district = district;
    this.StartTime = StartTime;
    this.endTime = endTime;
    this.amount = amount;
    this.gamemode = gamemode;
  }
}
