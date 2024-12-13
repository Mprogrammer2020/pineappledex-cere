import { ActivityEvent, EventDispatcher } from "@cere-activity-sdk/events";
import { CereWalletSigner } from "@cere-activity-sdk/signers";
import { EmbedWallet } from "@cere/embed-wallet";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useWeb3 } from "../config/Web3Context";

export const cereAppId = "2105";
export const cereBaseUrl =
  "https://stage-ai-event-service.core-stage.aws.cere.io/";

export class EventService {
  eventDispatcher = null;
  cereWalletSigner = null;

  constructor(token) {
    this.token = token;
  }

  async init() {
    const embedWallet = new EmbedWallet();

    embedWallet.init({
      authMethod: {
        type: "telegram-mini-app",
        token: this.token,
      },
    });

    await embedWallet.isReady;
    await embedWallet.connect();

    this.cereWalletSigner = new CereWalletSigner(embedWallet);
    await this.cereWalletSigner.isReady();

    const eventDispatcherParams = {
      appId: cereAppId,
      baseUrl: cereBaseUrl,
      connectionId: uuidv4(),
      sessionId: uuidv4(),
    };

    this.eventDispatcher = new EventDispatcher(
      this.cereWalletSigner,
      eventDispatcherParams
    );
  }

  async dispatchWalletConnectEvent() {
    if (!this.cereWalletSigner || !this.eventDispatcher) return;

    const event = new ActivityEvent("WALLET_CONNECT", {
      walletId: this.cereWalletSigner.address,
    });

    await this.eventDispatcher.dispatchEvent(event);
  }

  async dispatchSwapEvent(swapDetails) {
    if (!this.eventDispatcher) return;

    const event = new ActivityEvent("DEX_SWAP", swapDetails);

    await this.eventDispatcher.dispatchEvent(event);
  }
}

export function Test() {
  const { walletAddress } = useWeb3();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("cere-ref");

  const eventService = useMemo(() => new EventService(token), [token]);

  useEffect(() => {
    const init = async () => {
      await eventService.init();
      await eventService.dispatchWalletConnectEvent();
    };

    init();
  }, [eventService]);

  const onSendSwap = async () => {
    const cereWalletId = eventService.cereWalletSigner?.address;

    const swapDetails = {
      walletId: walletAddress,
      cereWalletId,
      amount: "0.01",
      operation: "BUY",
      pairId: "0x123",
      tokenId1: "0x123",
      tokenId2: "0x123",
    };

    await eventService.dispatchSwapEvent(swapDetails);
  };

  return (
    <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', marginTop: '100px' }}>
      <button className="main-btn" onClick={onSendSwap} disabled={!token}>
        Send Swap
      </button>
      {!token && <p>"cere-ref" param is empty</p>}
    </div>
  );
}
export default Test;
