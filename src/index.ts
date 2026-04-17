import { copyAsJira } from "./commands/copyAsJira";

let subscription: { dispose(): void } | null = null;

module.exports = {
  activate() {
    subscription = inkdrop.commands.add(document.body, {
      "copy-as-jira:copy": () => copyAsJira(),
    });
  },

  deactivate() {
    if (subscription) {
      subscription.dispose();
      subscription = null;
    }
  },
};
