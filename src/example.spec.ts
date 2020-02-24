class FriendsList {
  friends: string[] = [];

  addFriend(name: string) {
    this.friends.push(name);
  }

  announceFriendship(name: string) {
    global.console.log(`${name} is now a friend!`);
  }

  removeFriend(name: string) {
    const index = this.friends.indexOf(name);
    if (index === -1) {
      throw new Error('Friends not found!');
    }
    this.friends.splice(index, 1);
  }
}

describe('FriendsList', () => {
  let friendsList: FriendsList;

  beforeEach(() => {
    friendsList = new FriendsList();
  });

  it('initializes friends list', () => {
    expect(friendsList.friends.length).toEqual(0);
  });

  it('adds a friend to the list', () => {
    friendsList.addFriend('testing');
    expect(friendsList.friends.length).toEqual(1);
  });

  it('annuncnes friendship', () => {
    friendsList.announceFriendship = jest.fn();
    friendsList.addFriend('Ariel');
    expect(friendsList.announceFriendship).not.toHaveBeenCalled();
    friendsList.announceFriendship('Ariel');
    expect(friendsList.announceFriendship).toHaveBeenCalledWith('Ariel');
  });

  describe('describe friend', () => {
    it('removes a friend from the list', () => {
      friendsList.addFriend('Ariel');
      expect(friendsList.friends[0]).toEqual('Ariel');
      friendsList.removeFriend('Ariel');
      expect(friendsList.friends[0]).toBeUndefined();
    });

    it("throws an error when friend doesn't exists", () => {
      expect(() => friendsList.removeFriend('Ariel')).toThrow(Error);
    });
  });
});
