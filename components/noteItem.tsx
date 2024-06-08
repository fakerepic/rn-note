import { TouchableOpacity } from "react-native";
import { H5, ListItem, Paragraph, View } from "tamagui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePlatte } from "../themes/usePlatte";
import { SheetGroup } from "./bottom-sheets";
import { useDocID } from "../zustand/editor";
import { Link } from "expo-router";

type Props = {
  _id: string;
  title: string;
  texts?: string[];
  showDetail?: boolean;
};

const NoteItem = (props: Props) => {
  const { $text } = usePlatte();
  const { setDocID } = useDocID();
  return (
    <Link
      asChild
      href={{
        pathname: "/edit",
        params: { doc: props._id as string },
      }}
    >
      <TouchableOpacity>
        <View bg="$color2">
          <ListItem>
            <ListItem.Text>
              <H5 selectable={false}>{props.title}</H5>
            </ListItem.Text>
            <TouchableOpacity
              onPress={() => {
                setDocID(props._id);
                SheetGroup.open("noteDetail");
              }}
            >
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={16}
                color={$text}
              />
            </TouchableOpacity>
          </ListItem>
          {props.showDetail &&
            props.texts?.map((text, i) => (
              <View key={i} mx="$4" mb="$4" p="$4" br="$4" bg="$color3">
                <Paragraph color="$color7" selectable={false}>
                  {text && text?.length < 75
                    ? text
                    : text?.slice(0, 75) + " ..."}
                </Paragraph>
              </View>
            ))}
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default NoteItem;
