class Command {
   constructor(name, description, handler) {
      this.name = name;
      this.description = description;
      this.handler = handler;
   }

   execute(message, client) {
      this.handler(message, client);
   }
}
