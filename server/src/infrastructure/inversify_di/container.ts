import { Container } from "inversify";
import { AdminModule } from "./features/admin/admin.module";
import { AuthModule } from "./features/auth/auth.module";
import { UserModule } from "./features/user/user.module";
import { MutualFundModule } from "./features/mutual-fund/mutual-fund.module";
import { SipModule } from "./features/sip/sip.module";
import { PortfolioModule } from "./features/portfolio/portfolio.module";
import { ExternalModule } from "./features/external/external.module";
import { ExpenseTrackerModule } from "./features/expense-tracker/expense-tracker.module";
import { NotificationModules } from "./features/notification/notification.module";

const container = new Container({
  defaultScope: "Singleton",
  autobind: true,
});

container.load(
  AuthModule,
  UserModule,
  AdminModule,
  MutualFundModule,
  SipModule,
  PortfolioModule,
  ExternalModule,
  ExpenseTrackerModule,
  NotificationModules,
);

export { container };
