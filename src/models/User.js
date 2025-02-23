class User {
  constructor(id, username, email, passwordHash, role, createdAt) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.createdAt = createdAt;
  }
}

module.exports = User;
