import { Resend }
from "resend";

const resend =
  new Resend(
    process.env.RESEND_API_KEY
  );

type Props = {
  email: string;

  workspaceName: string;

  role: string;

  token: string;
};

export async function sendWorkspaceInvite({
  email,
  workspaceName,
  role,
  token,
}: Props) {
  const inviteUrl =
    `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;

  const result =
    await resend.emails.send({
      from:
        "Orbit <noreply@orbitdesk.online>",

      to: email,

      subject:
        `Join ${workspaceName}`,

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
            Orbit Workspace Invite
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

  return result;
}