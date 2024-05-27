import { TouchableOpacity } from "react-native";
import { View, Text, ListItem } from "tamagui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePlatte } from "../themes/usePlatte";

type Props = {
  _id: string;
  title: string;
};

const NoteItem = (props: Props) => {
  const { $text } = usePlatte();
  return (
    <ListItem>
      <ListItem.Text>{props.title}</ListItem.Text>
      <TouchableOpacity>
        <MaterialCommunityIcons name="dots-vertical" size={16} color={$text} />
      </TouchableOpacity>
    </ListItem>
  );
};

export default NoteItem;
