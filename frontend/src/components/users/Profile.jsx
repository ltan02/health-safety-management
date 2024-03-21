import { Avatar } from "@mui/material";

export default function Profile({ user }) {
  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 32,
        height: 32,
        fontSize: 14,
        margin: 0,
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  return user ? (
    <Avatar {...stringAvatar(`${user.firstName} ${user.lastName}`)} />
  ) : (
    <Avatar
      sx={{
        bgcolor: "grey",
        width: 32,
        height: 32,
        fontSize: 14,
        margin: 0,
      }}
    >
      {"U"}
    </Avatar>
  );
}
