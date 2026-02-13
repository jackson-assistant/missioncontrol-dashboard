import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAgents() {
  const { data, error, isLoading, mutate } = useSWR("/api/agents", fetcher, {
    refreshInterval: 15000,
  });
  return {
    agents: Array.isArray(data) ? data : [],
    error: data?.error || error,
    isLoading,
    mutate,
  };
}

export function useAgent(id: string) {
  const { data, error, isLoading } = useSWR(`/api/agents/${id}`, fetcher, {
    refreshInterval: 15000,
  });
  return { agent: data?.error ? null : data, error: data?.error || error, isLoading };
}

export function useAgentFiles(id: string) {
  const { data, error, isLoading } = useSWR(`/api/agents/${id}/files`, fetcher, {
    refreshInterval: 30000,
  });
  return {
    workspace: data?.workspace || "",
    files: data?.files || [],
    error: data?.error || error,
    isLoading,
  };
}

export function useHealth() {
  const { data, error, isLoading } = useSWR("/api/health", fetcher, {
    refreshInterval: 30000,
  });
  return { health: data, error, isLoading };
}

export function useChannels() {
  const { data, error, isLoading, mutate } = useSWR("/api/channels", fetcher, {
    refreshInterval: 30000,
  });
  return { channels: data, error: data?.error || error, isLoading, mutate };
}

export function useCron() {
  const { data, error, isLoading } = useSWR("/api/cron", fetcher, {
    refreshInterval: 30000,
  });
  return { cron: data, error: data?.error || error, isLoading };
}

export function useConfig() {
  const { data, error, isLoading } = useSWR("/api/config", fetcher, {
    refreshInterval: 60000,
  });
  return { config: data, error: data?.error || error, isLoading };
}

export function useLogs() {
  const { data, error, isLoading, mutate } = useSWR("/api/logs", fetcher, {
    refreshInterval: 10000,
  });
  return {
    logs: data?.entries || [],
    error: data?.error || error,
    isLoading,
    mutate,
  };
}

export function useTasks(status?: string) {
  const params = status ? `?status=${status}` : "";
  const { data, error, isLoading, mutate } = useSWR(`/api/tasks${params}`, fetcher, {
    refreshInterval: 10000,
  });
  return {
    tasks: Array.isArray(data) ? data : [],
    error: data?.error || error,
    isLoading,
    mutate,
  };
}

export function useUsage(period: string = "today") {
  const { data, error, isLoading, mutate } = useSWR(`/api/usage?period=${period}`, fetcher, {
    refreshInterval: 30000,
  });
  return {
    usage: data,
    error: data?.error || error,
    isLoading,
    mutate,
  };
}
