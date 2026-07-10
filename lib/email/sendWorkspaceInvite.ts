import { APP_CONFIG } from "@/lib/config/app";
import { sendEmail } from "./provider";

type Props = {
  email: string;
  workspaceName: string;
  role: string;
  token: string;
};

export async function sendWorkspaceInvite({ email, workspaceName, role, token }: Props): Promise<void> {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;

  await sendEmail({
    from: APP_CONFIG.email.from,
    to: email,
    subject: `Join ${workspaceName}`,
    html: `
      <div
        style="
          font-family:Inter,sans-serif;
          padding:40px;
          background:#050816;
          color:white;
        "
      >
        <h1>
          Gunimi Workspace Invite
        </h1>

        <p>
          You have been invited
          to join
          ${workspaceName}
          as
          ${role}.
        </p>

        <br/>

        <a
          href="${inviteUrl}"
          style="
            display:inline-block;
            background:#7c3aed;
            color:white;
            text-decoration:none;
            padding:14px 24px;
            border-radius:14px;
          "
        >
          Join Workspace
        </a>
      </div>
    `,
  });
}
