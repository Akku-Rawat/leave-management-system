const API_URL = import.meta.env.VITE_API_URL;
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json(); // { token, user } expect kar sakte ho
}


export async function getMyLeaves(token?: string) {
  const res = await fetch(`${API_URL}/leaves/my`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch leaves");
  return res.json();
}

export async function getStats(token?: string) {
  const res = await fetch(`${API_URL}/leaves/stats`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function createLeave(data: any, token?: string) {
  const res = await fetch(`${API_URL}/leaves/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create leave");
  return res.json();
}

export async function getAllLeaves(token?: string) {
  const res = await fetch(`${API_URL}/leaves/all`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch all leaves");
  return res.json();
}

export async function withdrawLeave(leaveId: string, token?: string) {
  const res = await fetch(`${API_URL}/leaves/${leaveId}/withdraw`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Failed to withdraw leave");
  return res.json();
}



export async function approveLeave(leaveId: string, token?: string) {
  const res = await fetch(`${API_URL}/leaves/approve/${leaveId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Failed to approve leave");
  return res.json();
}

export async function rejectLeave(leaveId: string, token?: string) {
  const res = await fetch(`${API_URL}/leaves/reject/${leaveId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Failed to reject leave");
  return res.json();
}

export async function sendMessage(leaveId: string, message: string, token?: string) {
  const res = await fetch(`${API_URL}/leaves/requests/${leaveId}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

export async function getReportSummary(token?: string) {
  const res = await fetch(`${API_URL}/reports/summary`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch report summary");
  return res.json();
}

export async function getHolidays(token?: string) {
  const res = await fetch(`${API_URL}/holidays`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch holidays");
  return res.json();
}
export async function getEmployees(token?: string) {
  const res = await fetch(`${API_URL}/employees`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
}

export async function getDelegations(token?: string) {
  const res = await fetch(`${API_URL}/delegations`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch delegations");
  return res.json();
}

export async function addDelegationReq(
  employeeName: string,
  delegatedTo: string,
  token?: string
) {
  const res = await fetch(`${API_URL}/delegations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ employeeName, delegatedTo }),
  });
  if (!res.ok) throw new Error("Failed to add delegation");
  return res.json();
}

export async function updateDelegationReq(
  id: string,
  status: "Approved" | "Rejected",
  token?: string
) {
  const res = await fetch(`${API_URL}/delegations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update delegation");
  return res.json();
}

export async function getEmployeeHistory(token?: string) {
  const res = await fetch(`${API_URL}/leaves/emphistory`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch employee history");
  return res.json();
}

export async function getLeaveRequests(token?: string) {
  const res = await fetch(`${API_URL}/leaves/requests`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch leave requests");
  return res.json();
}

// Team leaves for next week
export async function getTeamNextWeekLeaves(token?: string) {
  const res = await fetch(`${API_URL}/leaves/team-next-week`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch team leaves");
  return res.json();
}
