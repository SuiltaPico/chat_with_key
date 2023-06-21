import { defineComponent, ref } from "vue";
import ChatRecord, { UserMessage } from "../../interface/ChatRecord";
import { as_props, c, cl, refvmodel_type } from "../../common/utils";
import use_main_store from "../../store/main_store";
import { QBtn, QSpace, useQuasar } from "quasar";
import {
  ChatItem_Avatar,
  ChatItem_select_box,
  ChatRecordOperatingMode,
} from "../../pages/chat";
import { copy_with_notify } from "../../common/quasar_utils";
import { MorePopup, MorePopupBtn } from "./MorePopup";
import { vif } from "../../common/jsx_utils";
import { Editor, EditorCompoAPI } from "../common/Editor";
import { UseEditorRightBtnGroup } from "./UseEditorRightBtnGroup";
import { defer } from "lodash";
import { Editor2 } from "../common/Editor2";

export type UserMessageItemProps = {
  message: UserMessage;
  index: number;
  use_editor: boolean;
  chat_record: ChatRecord;
};

export const UserMessageItem = defineComponent<
  UserMessageItemProps,
  {},
  {},
  {},
  {},
  {},
  {},
  {
    delete: () => void;
    "update:use_editor": (value: boolean) => void;
  }
>({
  props: as_props<UserMessageItemProps>()([
    "message",
    "index",
    "use_editor",
    "chat_record",
  ]),
  emits: ["delete", "update:use_editor"],
  setup(props, ctx) {
    const ms = use_main_store();
    const qs = useQuasar();

    const more_popup_showing = ref(false);
    const content_editor = ref<EditorCompoAPI>();

    return () => {
      const { message, index, use_editor } = props;
      const curry_chat = ms.curry_chat;
      return (
        <div class="chat_item user">
          <div class="chat_item_main">
            {ChatItem_select_box(props.index)}
            {vif(
              ms.curry_chat.operating_mode === ChatRecordOperatingMode.select,
              <QBtn
                unelevated
                {...c`drag_handler self-start py-[0.4rem] px-[0.6rem] text-[0.9rem]`}
                icon="mdi-drag"
                ripple={false}
              ></QBtn>
            )}
            {ChatItem_Avatar(message, index, "mt-[2px]")}
            {vif(
              use_editor,
              <Editor2
                class="editor"
                init_language="markdown"
                ref={content_editor}
              ></Editor2>
            )}
            {vif(!use_editor, <div class="content">{message.content}</div>)}
            {vif(
              curry_chat.operating_mode === ChatRecordOperatingMode.default,
              <QSpace></QSpace>
            )}
            <div class="right_btn_group">
              {vif(
                curry_chat.operating_mode === ChatRecordOperatingMode.default &&
                  !use_editor,
                <div class="default">
                  <QBtn
                    {...c`text-xs text-zinc-300 p-2`}
                    icon="mdi-import"
                    flat
                    onClick={async () => {
                      ms.chat_body_input.promot = message.content;
                      ms.chat_body_input.inputter?.focus();
                    }}
                  ></QBtn>
                  <QBtn
                    {...c`text-xs text-zinc-300 p-2`}
                    icon="mdi-dots-horizontal"
                    flat
                  >
                    <MorePopup
                      {...refvmodel_type(more_popup_showing, "show")}
                      message={message}
                      onDelete={() => ctx.emit("delete")}
                      onEdit={(close_popup) => {
                        ctx.emit("update:use_editor", true);
                        close_popup();

                        defer(() => {
                          content_editor.value?.force_set_value(
                            message.content
                          );
                        });
                      }}
                    >
                      <MorePopupBtn
                        icon="mdi-content-copy"
                        label="复制"
                        onClick={() => {
                          copy_with_notify(qs, message.content);
                          more_popup_showing.value = false;
                        }}
                      ></MorePopupBtn>
                    </MorePopup>
                  </QBtn>
                </div>
              )}
              {UseEditorRightBtnGroup(
                use_editor,
                content_editor.value,
                message,
                index,
                ctx
              )}
            </div>
            <div class="max-md:min-w-full h-0 max-md:block order-2"></div>
          </div>
        </div>
      );
    };
  },
});
