import { TouchableOpacity } from "react-native";
import { ListItem } from "tamagui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePlatte } from "../themes/usePlatte";
import { SheetGroup } from "./bottom-sheets";
import { useDocID } from "../zustand/editor";

type Props = {
  _id: string;
  title: string;
};

const NoteItem = (props: Props) => {
  const { $text } = usePlatte();
  const { setDocID } = useDocID();
  return (
    <ListItem>
      <ListItem.Text>{props.title}</ListItem.Text>
      <TouchableOpacity
        onPress={() => {
          setDocID(props._id);
          SheetGroup.open("noteDetail");
        }}
      >
        <MaterialCommunityIcons name="dots-vertical" size={16} color={$text} />
      </TouchableOpacity>
    </ListItem>
  );
};

export default NoteItem;
