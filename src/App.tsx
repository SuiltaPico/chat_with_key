import {
  QBtn,
  QCheckbox,
  QDrawer,
  QHeader,
  QInnerLoading,
  QLayout,
  QPageContainer,
  QTooltip,
} from "quasar";
import { defineComponent, ref } from "vue";

import { RouterView } from "vue-router";

import { LeftBar } from "./components/LeftBar";
import use_main_store from "./store/main_store";
import { Maybe, c, refvmodel } from "./common/utils";

export default defineComponent({
  setup() {
    const ms = use_main_store();
    const show_left_bar = ref(false);
    const select_all = ref(false);

    return () => {
      return (
        <QLayout view="lHh LpR fFf">
          <QHeader {...c`app-header`}>
            <QBtn
              {...c`menu_switch`}
              flat
              icon="mdi-menu"
              onClick={() => (show_left_bar.value = true)}
            ></QBtn>
            <div id="app_header_slot"></div>
          </QHeader>
          <QDrawer
            {...c`left_drawer`}
            showIfAbove
            {...refvmodel(show_left_bar)}
            side="left"
            breakpoint={1040}
            width={ms.left_bar_width}
          >
            <LeftBar class="min-w-[300px] bg-zinc-900" />
          </QDrawer>
          <QPageContainer>
            <RouterView />
          </QPageContainer>
          <QInnerLoading
            showing={ms.is_loading}
            label="正在初始化……"
          ></QInnerLoading>
        </QLayout>
      );
    };
  },
});
