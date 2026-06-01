"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeTabsContext = void 0;
exports.NativeTabsNavigatorWrapper = NativeTabsNavigatorWrapper;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = __importStar(require("react"));
const NativeBottomTabsRouter_1 = require("./NativeBottomTabsRouter");
const NativeTabTrigger_1 = require("./NativeTabTrigger");
const NativeTabsView_1 = require("./NativeTabsView");
const utils_1 = require("./utils");
const standard_navigation_1 = require("../standard-navigation");
const children_1 = require("../utils/children");
// In Jetpack Compose, the default back behavior is to go back to the initial route.
const defaultBackBehavior = 'initialRoute';
exports.NativeTabsContext = react_2.default.createContext(false);
function NativeTabsContent({ state, descriptors, actions, emitter, 
// These per-tab style props are folded into `screenOptions` by `NativeTabsNavigatorWrapper` and
// read back per-tab from `descriptors`. Pull them out of `rest` so they aren't forwarded to
// `NativeTabsView` as top-level props.
labelStyle, iconColor, backgroundColor, badgeBackgroundColor, blurEffect, indicatorColor, badgeTextColor, rippleColor, disableIndicator, labelVisibilityMode, ...rest }) {
    if ((0, react_2.use)(exports.NativeTabsContext)) {
        throw new Error('Nesting Native Tabs inside each other is not supported natively. Use JS tabs for nesting instead.');
    }
    const { routes } = state;
    const visibleTabs = (0, react_2.useMemo)(() => routes
        // The <NativeTab.Trigger> always sets `hidden` to defined boolean value.
        // If it is not defined, then it was not specified, and we should hide the tab.
        .filter((route) => descriptors[route.key].options?.hidden !== true)
        .map((route) => ({
        options: descriptors[route.key].options,
        routeKey: route.key,
        name: route.name,
        contentRenderer: () => descriptors[route.key].render(),
    })), [routes, descriptors]);
    const visibleFocusedTabIndex = (0, react_2.useMemo)(() => visibleTabs.findIndex((tab) => tab.routeKey === routes[state.index].key), [visibleTabs, routes, state.index]);
    const visibleTabsKeys = (0, react_2.useMemo)(() => visibleTabs.map((tab) => tab.routeKey).join(';'), [visibleTabs]);
    if (visibleFocusedTabIndex < 0) {
        if (process.env.NODE_ENV !== 'production') {
            const focusedRoute = routes[state.index];
            throw new Error(`The focused tab in NativeTabsView cannot be displayed. Make sure path is correct and the route is not hidden. Route: "${focusedRoute?.href ?? focusedRoute?.name}"`);
        }
    }
    const focusedIndex = visibleFocusedTabIndex >= 0 ? visibleFocusedTabIndex : 0;
    const provenanceRef = (0, react_2.useRef)(0);
    const onTabChange = (0, react_2.useCallback)(({ selectedKey, provenance, isNativeAction, isPrevented = false }) => {
        if (isPrevented) {
            // The native side blocked selecting a disabled tab. Notify listeners, but
            // don't advance navigation or acknowledge a (non-existent) state transition,
            // so the provenance counter is left untouched.
            emitter.emit({
                type: 'tabPress',
                target: selectedKey,
                data: {
                    __internalTabsType: 'native',
                    isPrevented: true,
                },
            });
            return;
        }
        // We should always send the last provenance we got from native side
        provenanceRef.current = provenance;
        if (isNativeAction) {
            const selectedRoute = routes.find((route) => route.key === selectedKey);
            if (!selectedRoute) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(`NativeTabs received a native tab change for an unknown tab (key: "${selectedKey}"), so the change was ignored. ` +
                        `This is most likely a bug in expo-router. Please report it at https://github.com/expo/expo/issues.`);
                }
                return;
            }
            emitter.emit({
                type: 'tabPress',
                target: selectedKey,
                data: {
                    __internalTabsType: 'native',
                    isPrevented: false,
                },
            });
            actions.navigate(selectedRoute.name);
        }
    }, [routes, actions, emitter]);
    // Compile-time guard: everything spread onto `<NativeTabsView>` must be a prop it declares. The
    // `Record<…, never>` turns any prop the view doesn't accept into a type error here instead of
    // letting it leak silently through the spread.
    const nativeTabsViewProps = rest;
    return ((0, jsx_runtime_1.jsx)(exports.NativeTabsContext, { value: true, children: (0, react_1.createElement)(NativeTabsView_1.NativeTabsView, { ...nativeTabsViewProps, key: visibleTabsKeys, focusedIndex: focusedIndex, 
            // Provenance should only be sent with updates, and updates
            // on JS side are only triggered by rerender, so passing ref
            // here is ok.
            provenance: provenanceRef.current, tabs: visibleTabs, onTabChange: onTabChange }) }));
}
const NativeTabsNavigatorWithContext = (0, standard_navigation_1.unstable_createStandardRouterNavigator)(NativeTabsContent, NativeBottomTabsRouter_1.NativeBottomTabsRouter, { useOnlyUserDefinedScreens: true });
function NativeTabsNavigatorWrapper(props) {
    const triggerChildren = (0, react_2.useMemo)(() => (0, children_1.getAllChildrenOfType)(props.children, NativeTabTrigger_1.NativeTabTrigger), [props.children]);
    const nonTriggerChildren = (0, react_2.useMemo)(() => (0, children_1.getAllChildrenNotOfType)(props.children, NativeTabTrigger_1.NativeTabTrigger), [props.children]);
    const { backBehavior = defaultBackBehavior, labelStyle, iconColor, blurEffect, backgroundColor, badgeBackgroundColor, indicatorColor, badgeTextColor, shadowColor, rippleColor, disableIndicator, labelVisibilityMode, tintColor, disableTransparentOnScrollEdge, } = props;
    const screenOptions = (0, react_2.useMemo)(() => {
        const processedLabelStyle = (0, utils_1.convertLabelStylePropToObject)(labelStyle);
        const processedIconColor = (0, utils_1.convertIconColorPropToObject)(iconColor);
        const selectedLabelStyle = processedLabelStyle.selected
            ? {
                ...processedLabelStyle.selected,
                color: processedLabelStyle.selected.color ?? tintColor,
            }
            : tintColor
                ? { color: tintColor }
                : undefined;
        return {
            disableTransparentOnScrollEdge,
            labelStyle: processedLabelStyle.default,
            selectedLabelStyle,
            iconColor: processedIconColor.default,
            selectedIconColor: processedIconColor.selected ?? tintColor,
            blurEffect,
            backgroundColor,
            badgeBackgroundColor,
            indicatorColor,
            badgeTextColor,
            shadowColor,
            rippleColor,
            disableIndicator,
            labelVisibilityMode,
            tintColor,
        };
    }, [
        labelStyle,
        iconColor,
        blurEffect,
        backgroundColor,
        badgeBackgroundColor,
        indicatorColor,
        badgeTextColor,
        shadowColor,
        rippleColor,
        disableIndicator,
        labelVisibilityMode,
        tintColor,
        disableTransparentOnScrollEdge,
    ]);
    return ((0, jsx_runtime_1.jsx)(NativeTabsNavigatorWithContext, { ...props, children: triggerChildren, nonTriggerChildren: nonTriggerChildren, screenOptions: screenOptions, 
        // Passed to TabRouter
        backBehavior: backBehavior }));
}
//# sourceMappingURL=NativeBottomTabsNavigator.js.map