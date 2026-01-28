import { accountRelations, accounts } from "./accounts"
import { bookRelations, books } from "./books"
import { pageRelations, pages } from "./pages"
import { sessionRelations, sessions } from "./sessions"
import { userSettings, userSettingsRelations } from "./user-settings"
import { userRelations, users } from "./users"

import { verifications } from "./verifications"

export const schema = {
  accounts,
  accountRelations,
  users,
  userRelations,
  sessions,
  sessionRelations,
  verifications,
  books,
  bookRelations,
  pages,
  pageRelations,
  userSettings,
  userSettingsRelations
}
