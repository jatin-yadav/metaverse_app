import type { User } from "./User";
import { OutgoingMessage } from "./types";

export class RoomManager {
  rooms: Map<string, User[]> = new Map();
  static instance: RoomManager;

  private constructor() {}

  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  public addUser(spaceId: string, user: User): void {
    const users = this.rooms.get(spaceId) ?? [];
    if (!users.some((u) => u.id === user.id)) {
      this.rooms.set(spaceId, [...users, user]);
    }
  }

  public removeUser(user: User, spaceId: string): void {
    const users = this.rooms.get(spaceId);
    if (!users) return;

    const filteredUsers = users.filter((u) => u.id !== user.id);
    if (filteredUsers.length === 0) {
      this.rooms.delete(spaceId);
    } else {
      this.rooms.set(spaceId, filteredUsers);
    }
  }

  public broadcast(
    message: OutgoingMessage,
    sender: User,
    roomId: string
  ): void {
    const users = this.rooms.get(roomId);
    if (!users || users.length === 0) return;

    users.forEach((user) => {
      if (user.id !== sender.id) {
        user.send(message);
      }
    });
  }
}
