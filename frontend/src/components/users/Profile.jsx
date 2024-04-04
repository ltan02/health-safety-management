import { Avatar } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';

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
        width: 26,
        height: 26,
        fontSize: 12,
        margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
        width: 26,
        height: 26,
        fontSize: 12,
        margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PersonIcon />
    </Avatar>
  );
}
