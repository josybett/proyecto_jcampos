export class UserReadDTO {
  constructor(user) {
    this.id = user._id
    this.name = user.first_name + " " + user.last_name
    this.email = user.email
    this.role = user.role
  }
}

export class UserSaveDTO {
  constructor(user) {
    this.first_name = user.first_name
    this.last_name = user.last_name
    this.email = user.email
    this.age = user.age
    this.password = user.password
    this.role = user?.role ?? 'user'
  }
}