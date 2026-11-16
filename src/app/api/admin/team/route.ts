import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const team = getTableData<any[]>("team_users", []);
  return NextResponse.json({ success: true, team });
}

export async function POST(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    const { name, username, email, password, role, status } = body;

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, Username, Email, and Password are all required." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, "");
    const cleanEmail = email.trim().toLowerCase();

    const validRoles = ["Super Admin", "Admin", "Moderator"];
    const assignedRole = validRoles.includes(role) ? role : "Admin";

    const team = getTableData<any[]>("team_users", []);

    // Check duplicate username or email
    const duplicate = team.find(
      (u) =>
        u.username?.toLowerCase() === cleanUsername ||
        u.email?.toLowerCase() === cleanEmail
    );

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          message:
            duplicate.username?.toLowerCase() === cleanUsername
              ? `Username "@${cleanUsername}" is already taken.`
              : `Email address "${cleanEmail}" is already registered.`,
        },
        { status: 400 }
      );
    }

    // Role-based permissions
    let permissions = ["services", "pricing", "content", "portfolio", "orders", "enquiries", "notifications"];
    if (assignedRole === "Super Admin") {
      permissions = ["all"];
    } else if (assignedRole === "Moderator") {
      permissions = ["testimonials", "enquiries_view", "content_draft"];
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password: password.trim(),
      role: assignedRole,
      status: status || "Active",
      lastLogin: null,
      permissions,
      createdAt: new Date().toISOString(),
    };

    team.push(newUser);
    saveTableData("team_users", team);

    recordActivity("CREATE", "TEAM", `Added team member @${cleanUsername} as ${assignedRole}`, newUser.name);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to add team member" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    let team = getTableData<any[]>("team_users", []);
    const index = team.findIndex((u) => u.id === body.id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Protect root wefounder account from accidental demotion or suspension
    if (team[index].username === "wefounder" || team[index].id === "usr_wefounder") {
      if (body.status === "Suspended") {
        return NextResponse.json({ success: false, message: "Root Super Admin account cannot be suspended." }, { status: 400 });
      }
      if (body.role && body.role !== "Super Admin") {
        return NextResponse.json({ success: false, message: "Root Super Admin role cannot be changed." }, { status: 400 });
      }
    }

    const current = team[index];
    const updated = {
      ...current,
      name: body.name ? body.name.trim() : current.name,
      username: body.username ? body.username.trim().toLowerCase().replace(/\s+/g, "") : current.username,
      email: body.email ? body.email.trim().toLowerCase() : current.email,
      role: body.role || current.role,
      status: body.status || current.status,
      updatedAt: new Date().toISOString(),
    };

    // If new password provided, update it
    if (body.password && body.password.trim().length > 0) {
      updated.password = body.password.trim();
    }

    // Update permissions if role changed
    if (updated.role === "Super Admin") {
      updated.permissions = ["all"];
    } else if (updated.role === "Moderator") {
      updated.permissions = ["testimonials", "enquiries_view", "content_draft"];
    } else {
      updated.permissions = ["services", "pricing", "content", "portfolio", "orders", "enquiries", "notifications"];
    }

    team[index] = updated;
    saveTableData("team_users", team);

    recordActivity("UPDATE", "TEAM", `Updated team user @${updated.username} (${updated.role})`);

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  initializeDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    let team = getTableData<any[]>("team_users", []);
    const userToDelete = team.find((u) => u.id === id);

    if (!userToDelete) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Protection rule
    if (userToDelete.username === "wefounder" || userToDelete.id === "usr_wefounder") {
      return NextResponse.json(
        { success: false, message: "Root Super Admin account (@wefounder) cannot be deleted." },
        { status: 400 }
      );
    }

    team = team.filter((u) => u.id !== id);
    saveTableData("team_users", team);

    recordActivity("DELETE", "TEAM", `Removed team member: @${userToDelete.username} (${userToDelete.name})`);

    return NextResponse.json({ success: true, message: "Team member removed" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete team member" }, { status: 500 });
  }
}
