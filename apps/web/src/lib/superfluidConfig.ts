import sfMetadata from "@superfluid-finance/metadata";

/**
 * Base Sepolia protocol-v1 subgraph (metadata JSON may omit `hostedEndpoint`).
 * @see https://docs.superfluid.org/docs/technical-reference/subgraph
 */
const BASE_SEPOLIA_PROTOCOL_V1 =
  "https://subgraph-endpoints.superfluid.dev/base-sepolia/protocol-v1";

/**
 * Protocol-v1 subgraph URL for money-streaming queries (`streams`, `accounts`, …).
 * Prefer `NEXT_PUBLIC_SUPERFLUID_SUBGRAPH`; otherwise use hosted endpoint from metadata.
 */
export function resolveSuperfluidProtocolSubgraphUrl(chainId: number): string | undefined {
  const fromEnv = process.env.NEXT_PUBLIC_SUPERFLUID_SUBGRAPH?.trim();
  if (fromEnv) return fromEnv;

  const net = sfMetadata.getNetworkByChainId(chainId);
  const hosted = net?.subgraphV1?.hostedEndpoint?.trim();
  if (hosted) return hosted;

  if (chainId === 84532) return BASE_SEPOLIA_PROTOCOL_V1;

  return undefined;
}
