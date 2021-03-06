import { StatusCodes } from "http-status-codes";
import { setupContainer, container } from "../../container";
import { applyKoaMiddlewares } from "../apply-middlewares";
import { DonationCurrencies } from "../../../core/donations/domain/donation-domain";
import { ApiTestingKit, createApiTestingKit } from "../utils";

setupContainer();

describe("Donation Routes", () => {
  let apiKit: ApiTestingKit;

  beforeEach(async () => {
    apiKit = await createApiTestingKit(container);
    applyKoaMiddlewares(apiKit.app);
  });

  afterEach(() => apiKit.connection.close());

  it("should response with 201 CREATED", async () => {
    const req = await apiKit.request
      .post("/api/donate")
      .send({ amount: 50, currency: DonationCurrencies.RUB })
      .set("Accept", "application/json")
      .expect(StatusCodes.CREATED)
      .expect("Content-Type", /json/);

    expect(req.body.ok).toBeTruthy();
  });

  it("should response with 422 UNPROCESSABLE ENTITY if amount below 0", async () => {
    const res = await apiKit.request
      .post("/api/donate")
      .send({ amount: -10, currency: DonationCurrencies.RUB })
      .set("Accept", "application/json")
      .expect(StatusCodes.UNPROCESSABLE_ENTITY)
      .expect("Content-Type", /json/);

    expect(res.body.message).not.toBeNull();
  });

  it("should response with 422 UNPROCESSABLE ENTITY if currency is not supported", async () => {
    const res = await apiKit.request
      .post("/api/donate")
      .send({ amount: 50, currency: 7 })
      .set("Accept", "application/json")
      .expect(StatusCodes.UNPROCESSABLE_ENTITY)
      .expect("Content-Type", /json/);

    expect(res.body.message).not.toBeNull();
  });

  it("should response with 422 UNPROCESSABLE ENTITY if any of body's parameters is not given", async () => {
    const res = await apiKit.request
      .post("/api/donate")
      .send({ amount: null, currency: DonationCurrencies.RUB })
      .set("Accept", "application/json")
      .expect(StatusCodes.UNPROCESSABLE_ENTITY)
      .expect("Content-Type", /json/);

    expect(res.body.message).not.toBeNull();
  });
});
