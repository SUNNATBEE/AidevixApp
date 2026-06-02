import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';
import { CodeExample, EXAMPLES } from './examples';
import AiHelperModal from './AiHelperModal';

type TabKey = 'html' | 'css' | 'js' | 'output';
type CodeTabKey = Exclude<TabKey, 'output'>;

type ConsoleLine = { id: number; level: 'log' | 'warn' | 'error'; text: string };

const CONSOLE_LIMIT = 200;
const AUTO_SAVE_DEBOUNCE_MS = 500;
const STORAGE_KEYS: Record<CodeTabKey, string> = {
  html: '@aidevix_playground_html',
  css: '@aidevix_playground_css',
  js: '@aidevix_playground_js',
};

const DEFAULT_HTML = `<h1>Salom Aidevix!</h1>
<p>Bu yerda kod yozib natijasini ko'rishingiz mumkin.</p>
<button id="btn">Bosing</button>`;

const DEFAULT_CSS = `body {
  background: #0f172a;
  color: white;
  font-family: sans-serif;
  padding: 20px;
}
h1 { color: #6366f1; }
button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
}`;

const DEFAULT_JS = `console.log("Aidevix Playground ishga tushdi!");

const btn = document.getElementById('btn');
if (btn) {
  btn.addEventListener('click', () => {
    console.log('Tugma bosildi!');
  });
}`;

const DEFAULTS: Record<CodeTabKey, string> = {
  html: DEFAULT_HTML,
  css: DEFAULT_CSS,
  js: DEFAULT_JS,
};

const consoleBridge = `
<script>
(function(){
  function send(level, args){
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        source: 'aidevix-console',
        level: level,
        text: args.map(function(a){
          if (a === null) return 'null';
          if (a === undefined) return 'undefined';
          if (typeof a === 'object') {
            try { return JSON.stringify(a); } catch(e) { return String(a); }
          }
          return String(a);
        }).join(' ')
      }));
    } catch(e) {}
  }
  var _log = console.log, _err = console.error, _warn = console.warn;
  console.log = function(){ send('log', [].slice.call(arguments)); _log.apply(console, arguments); };
  console.error = function(){ send('error', [].slice.call(arguments)); _err.apply(console, arguments); };
  console.warn = function(){ send('warn', [].slice.call(arguments)); _warn.apply(console, arguments); };
  window.addEventListener('error', function(ev){
    send('error', [(ev.message || 'Xatolik') + ' (qator ' + (ev.lineno || '?') + ')']);
  });
})();
</script>`;

const wrapHtmlOnly = (html: string) => `<!DOCTYPE html><html><body>${html}</body></html>`;
const wrapHtmlCss = (html: string, css: string) =>
  `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}</body></html>`;
const wrapJsRun = (html: string, js: string) => `<!DOCTYPE html><html><head>${consoleBridge}</head><body>${html}<script>
try {
${js}
} catch(e) {
  console.error('Xatolik: ' + (e && e.message ? e.message : e));
}
</script></body></html>`;
const wrapFull = (html: string, css: string, js: string) =>
  `<!DOCTYPE html><html><head><style>${css}</style>${consoleBridge}</head><body>${html}<script>
try {
${js}
} catch(e) {
  console.error('Xatolik: ' + (e && e.message ? e.message : e));
}
</script></body></html>`;

const TAB_META: Record<TabKey, { label: string; icon: keyof typeof Ionicons.glyphMap; role: string }> = {
  html: { label: 'HTML', icon: 'code-slash-outline', role: 'Skelet — sahifa tuzilishi' },
  css: { label: 'CSS', icon: 'color-palette-outline', role: 'Dizayn — ko\'rinish va stil' },
  js: { label: 'JS', icon: 'flash-outline', role: 'Funksiya — harakat va mantiq' },
  output: { label: 'NATIJA', icon: 'play-circle-outline', role: 'Hammasi birga ishlaydi' },
};

const SNIPPETS: Record<CodeTabKey, Array<{ label: string; value: string }>> = {
  html: [
    { label: '<', value: '<' },
    { label: '>', value: '>' },
    { label: '</>', value: '</>' },
    { label: '=""', value: '=""' },
    { label: '/', value: '/' },
    { label: '⇥', value: '  ' },
  ],
  css: [
    { label: '{', value: '{' },
    { label: '}', value: '}' },
    { label: ';', value: ';' },
    { label: ':', value: ': ' },
    { label: '( )', value: '()' },
    { label: '⇥', value: '  ' },
  ],
  js: [
    { label: '( )', value: '()' },
    { label: '{ }', value: '{}' },
    { label: ';', value: ';' },
    { label: '=>', value: ' => ' },
    { label: '"', value: '"' },
    { label: '\'', value: '\'' },
    { label: '⇥', value: '  ' },
  ],
};

type InfoEntry = { title: string; tagline: string; points: string[]; example: string };
const INFO_CONTENT: Record<TabKey, InfoEntry> = {
  html: {
    title: 'HTML — Skelet',
    tagline: 'HyperText Markup Language. Sahifaning suyak tuzilishi.',
    points: [
      'Sahifada nima borligini belgilaydi: matn, rasm, tugma, ro\'yxat...',
      'Teglar bilan yoziladi: <h1>, <p>, <button>, <img>, <div>',
      'Ko\'p teglar ochiluvchi va yopiluvchi: <p>...</p>',
      'Atributlar tegga qo\'shimcha ma\'lumot beradi: <a href="...">',
      'HTML faqat tuzilish — stillash CSS, harakat JS bilan',
    ],
    example: '<h1>Salom</h1>\n<p>Bu paragraf.</p>',
  },
  css: {
    title: 'CSS — Dizayn',
    tagline: 'Cascading Style Sheets. Sahifani chiroyli qiladi.',
    points: [
      'HTML elementlariga ko\'rinish beradi: rang, o\'lcham, joy',
      'Selektorlar: tag (h1), klass (.btn), id (#header)',
      'Box model: margin (tashqi), padding (ichki), border',
      'Layout: flex va grid bilan elementlarni joylashtirish',
      'Animatsiya: transition va @keyframes',
    ],
    example: 'h1 {\n  color: blue;\n  font-size: 24px;\n}',
  },
  js: {
    title: 'JavaScript — Funksiya',
    tagline: 'Sahifaga jonlilik va mantiq beradi.',
    points: [
      'O\'zgaruvchilar: let, const',
      'Mantiq: if/else, for, while',
      'Funksiyalar: function name() { ... } yoki strelka =>',
      'DOM bilan ishlash: document.getElementById, querySelector',
      'Eventlar: addEventListener (click, input, submit)',
      'console.log() — xato qidirish va tekshirish uchun',
    ],
    example: 'const btn = document.getElementById(\'btn\');\nbtn.addEventListener(\'click\', () => {\n  console.log(\'Bosildi\');\n});',
  },
  output: {
    title: 'NATIJA — Birga',
    tagline: 'HTML + CSS + JS — barchasi bir vebsahifada.',
    points: [
      'Brauzer kodlarni ko\'rsatadi va ishga tushiradi',
      'Tartib: avval HTML o\'qiladi, keyin CSS qo\'llanadi, oxirida JS',
      'console.log natijasi pastda Console panelida ko\'rinadi',
      'Xatolik bo\'lsa qizil rangda ko\'rsatiladi',
    ],
    example: 'Yuqoridagi "Hammasi" tugmasini bosing — to\'liq sahifa hosil bo\'ladi.',
  },
};

const CodePlaygroundScreen = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<any>();

  // Playground tola-ekran tajriba — pastdagi tab bar ekranni va toast'ni yopib qoladi.
  // useFocusEffect ishlatamiz: focus paytida yashiramiz, blur paytida qaytaramiz.
  // useEffect ishlatsak, HomeStack ichida boshqa ekranga o'tganda tab bar yopiq qoladi.
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent?.();
      parent?.setOptions({ tabBarStyle: { display: 'none' } });
      return () => {
        parent?.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation])
  );

  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [activeTab, setActiveTab] = useState<TabKey>('html');
  const [hydrated, setHydrated] = useState(false);

  const [htmlPreview, setHtmlPreview] = useState<string | null>(null);
  const [cssPreview, setCssPreview] = useState<string | null>(null);
  const [jsPreview, setJsPreview] = useState<string | null>(null);
  const [fullPreview, setFullPreview] = useState<string | null>(null);
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  const [showExamples, setShowExamples] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [exampleFilter, setExampleFilter] = useState<'all' | 'html' | 'css' | 'js'>('all');

  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const lineIdRef = useRef(0);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [h, c, j] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.html),
          AsyncStorage.getItem(STORAGE_KEYS.css),
          AsyncStorage.getItem(STORAGE_KEYS.js),
        ]);
        if (h !== null) setHtml(h);
        if (c !== null) setCss(c);
        if (j !== null) setJs(j);
      } catch {
        // ignore
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEYS.html, html).catch(() => {});
    }, AUTO_SAVE_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [html, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEYS.css, css).catch(() => {});
    }, AUTO_SAVE_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [css, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEYS.js, js).catch(() => {});
    }, AUTO_SAVE_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [js, hydrated]);

  const appendConsole = (level: ConsoleLine['level'], text: string) => {
    lineIdRef.current += 1;
    const newLine = { id: lineIdRef.current, level, text };
    setConsoleLines((prev) => {
      const next = [...prev, newLine];
      return next.length > CONSOLE_LIMIT ? next.slice(next.length - CONSOLE_LIMIT) : next;
    });
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data?.source === 'aidevix-console') {
        appendConsole(data.level || 'log', String(data.text ?? ''));
      }
    } catch {
      // ignore
    }
  };

  const runHtml = () => {
    triggerHaptic('medium');
    setHtmlPreview(wrapHtmlOnly(html));
  };

  const runCss = () => {
    triggerHaptic('medium');
    setCssPreview(wrapHtmlCss(html, css));
  };

  const runJs = () => {
    triggerHaptic('medium');
    setConsoleLines([]);
    setJsPreview(wrapJsRun(html, js) + `<!--${Date.now()}-->`);
  };

  const runAll = () => {
    triggerHaptic('success');
    setConsoleLines([]);
    setFullPreview(wrapFull(html, css, js) + `<!--${Date.now()}-->`);
    setActiveTab('output');
  };

  const currentTab = activeTab === 'output' ? null : (activeTab as CodeTabKey);
  const currentValue = currentTab ? (currentTab === 'html' ? html : currentTab === 'css' ? css : js) : '';
  const currentSetter = currentTab
    ? currentTab === 'html'
      ? setHtml
      : currentTab === 'css'
      ? setCss
      : setJs
    : undefined;

  const insertSnippet = (snippet: string) => {
    if (!currentSetter) return;
    triggerHaptic('light');
    const { start, end } = selection;
    const safeStart = Math.min(Math.max(start, 0), currentValue.length);
    const safeEnd = Math.min(Math.max(end, safeStart), currentValue.length);
    const newVal = currentValue.slice(0, safeStart) + snippet + currentValue.slice(safeEnd);
    currentSetter(newVal);
    const cursor = safeStart + snippet.length;
    setSelection({ start: cursor, end: cursor });
  };

  const onReset = () => {
    if (!currentTab) return;
    Alert.alert(
      'Kodni tiklash',
      'Joriy ' + TAB_META[currentTab].label + ' kodingiz o\'chiriladi va default kod qaytariladi. Davom etamizmi?',
      [
        { text: 'Bekor', style: 'cancel' },
        {
          text: 'Tikla',
          style: 'destructive',
          onPress: () => {
            triggerHaptic('warning');
            const defaultCode = DEFAULTS[currentTab];
            if (currentTab === 'html') setHtml(defaultCode);
            else if (currentTab === 'css') setCss(defaultCode);
            else setJs(defaultCode);
            setSelection({ start: 0, end: 0 });
          },
        },
      ]
    );
  };

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setCopiedToast(msg);
    toastTimerRef.current = setTimeout(() => setCopiedToast(null), 1500);
  };

  const onCopy = async () => {
    if (!currentTab) return;
    try {
      await Clipboard.setStringAsync(currentValue);
      triggerHaptic('success');
      showToast('Nusxalandi!');
    } catch {
      triggerHaptic('error');
      showToast('Nusxalashda xatolik');
    }
  };

  const onSelectExample = (ex: CodeExample) => {
    Alert.alert(
      ex.title,
      'Joriy kodlaringiz misol bilan almashtiriladi. Davom etamizmi?',
      [
        { text: 'Bekor', style: 'cancel' },
        {
          text: 'Yuklash',
          onPress: () => {
            triggerHaptic('success');
            setHtml(ex.html);
            setCss(ex.css);
            setJs(ex.js);
            setShowExamples(false);
            setHtmlPreview(null);
            setCssPreview(null);
            setJsPreview(null);
            setFullPreview(null);
            setConsoleLines([]);
            showToast(ex.title + ' yuklandi');
          },
        },
      ]
    );
  };

  const onRunForActive = () => {
    if (activeTab === 'html') return runHtml();
    if (activeTab === 'css') return runCss();
    if (activeTab === 'js') return runJs();
    return runAll();
  };

  const runLabel = useMemo(() => {
    if (activeTab === 'html') return 'HTML ni ishga tushirish';
    if (activeTab === 'css') return 'HTML + CSS ni ishga tushirish';
    if (activeTab === 'js') return 'JS ni ishga tushirish';
    return 'Hammasini birga ishga tushirish';
  }, [activeTab]);

  const filteredExamples = useMemo(() => {
    if (exampleFilter === 'all') return EXAMPLES;
    return EXAMPLES.filter((e) => e.category === exampleFilter);
  }, [exampleFilter]);

  const currentInfo = INFO_CONTENT[activeTab];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.headerIconButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => {
            triggerHaptic('light');
            navigation.goBack();
          }}
          activeOpacity={0.7}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Code Playground</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]} numberOfLines={1}>
            Yozing → Ishga tushiring → Natijani ko'ring
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.headerIconButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => {
            triggerHaptic('light');
            setShowExamples(true);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="library-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.runAllButton, { backgroundColor: colors.primary }]}
          onPress={runAll}
          activeOpacity={0.85}
        >
          <Ionicons name="play" size={16} color="#fff" />
          <Text style={styles.runAllText}>Hammasi</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {(Object.keys(TAB_META) as TabKey[]).map((tab) => {
          const meta = TAB_META[tab];
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                triggerHaptic('light');
                setActiveTab(tab);
              }}
              style={[styles.tab, isActive && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            >
              <Ionicons
                name={meta.icon}
                size={16}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.tabText, { color: isActive ? colors.primary : colors.textSecondary }]}>
                {meta.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.roleBadge, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => {
          triggerHaptic('light');
          setShowInfo(true);
        }}
        activeOpacity={0.7}
      >
        <Ionicons name={TAB_META[activeTab].icon} size={14} color={colors.primary} />
        <Text style={[styles.roleText, { color: colors.textSecondary, flex: 1 }]}>{TAB_META[activeTab].role}</Text>
        <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
      </TouchableOpacity>

      {currentTab && (
        <View style={styles.editorSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            style={styles.snippetBar}
            contentContainerStyle={styles.snippetBarContent}
          >
            {SNIPPETS[currentTab].map((snip, idx) => (
              <TouchableOpacity
                key={`${currentTab}-${idx}`}
                style={[styles.snippetButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => insertSnippet(snip.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.snippetText, { color: colors.text }]}>{snip.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            multiline
            style={[styles.editor, { color: colors.text, backgroundColor: colors.card }]}
            value={currentValue}
            onChangeText={(t) => currentSetter && currentSetter(t)}
            onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
            selection={selection}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            placeholder={`${TAB_META[activeTab].label} kodini shu yerga yozing...`}
            placeholderTextColor={colors.textSecondary}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.runButton, { backgroundColor: colors.primary, flex: 1 }]}
              onPress={onRunForActive}
              activeOpacity={0.85}
            >
              <Ionicons name="play" size={16} color="#fff" />
              <Text style={styles.runButtonText}>{runLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '55' }]}
              onPress={() => {
                triggerHaptic('light');
                setShowAi(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="sparkles" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={onCopy}
              activeOpacity={0.7}
            >
              <Ionicons name="copy-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={onReset}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.previewBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Natija</Text>
            {currentTab === 'html' && htmlPreview && (
              <WebView originWhitelist={['*']} source={{ html: htmlPreview }} style={styles.webview} />
            )}
            {currentTab === 'css' && cssPreview && (
              <WebView originWhitelist={['*']} source={{ html: cssPreview }} style={styles.webview} />
            )}
            {currentTab === 'js' && (
              <View style={styles.jsRunContainer}>
                {jsPreview && (
                  <WebView
                    originWhitelist={['*']}
                    source={{ html: jsPreview }}
                    style={styles.jsHiddenWebView}
                    onMessage={handleMessage}
                    javaScriptEnabled
                  />
                )}
                <ScrollView style={styles.consoleScroll} contentContainerStyle={styles.consoleContent}>
                  {consoleLines.length === 0 ? (
                    <Text style={[styles.consoleEmpty, { color: colors.textSecondary }]}>
                      {jsPreview ? 'console.log chiqishi shu yerda ko\'rinadi...' : 'Run tugmasini bosing'}
                    </Text>
                  ) : (
                    consoleLines.map((line) => (
                      <Text
                        key={line.id}
                        style={[
                          styles.consoleLine,
                          {
                            color:
                              line.level === 'error'
                                ? colors.error
                                : line.level === 'warn'
                                ? colors.accent
                                : colors.text,
                          },
                        ]}
                      >
                        {line.level === 'error' ? '✖ ' : line.level === 'warn' ? '⚠ ' : '› '}
                        {line.text}
                      </Text>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
            {((currentTab === 'html' && !htmlPreview) || (currentTab === 'css' && !cssPreview)) && (
              <View style={styles.previewPlaceholder}>
                <Ionicons name="play-circle-outline" size={32} color={colors.textSecondary} />
                <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
                  Yuqoridagi tugmani bosing
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {activeTab === 'output' && (
        <View style={styles.outputSection}>
          <TouchableOpacity
            style={[styles.runButton, { backgroundColor: colors.primary, marginHorizontal: spacing.md }]}
            onPress={runAll}
            activeOpacity={0.85}
          >
            <Ionicons name="play" size={16} color="#fff" />
            <Text style={styles.runButtonText}>Qayta ishga tushirish</Text>
          </TouchableOpacity>

          <View style={[styles.outputWebViewBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {fullPreview ? (
              <WebView
                originWhitelist={['*']}
                source={{ html: fullPreview }}
                style={styles.webview}
                onMessage={handleMessage}
                javaScriptEnabled
              />
            ) : (
              <View style={styles.previewPlaceholder}>
                <Ionicons name="rocket-outline" size={36} color={colors.textSecondary} />
                <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
                  "Hammasi" tugmasini bosing
                </Text>
              </View>
            )}
          </View>

          {consoleLines.length > 0 && (
            <View style={[styles.outputConsole, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Console</Text>
              <ScrollView contentContainerStyle={styles.consoleContent}>
                {consoleLines.map((line) => (
                  <Text
                    key={line.id}
                    style={[
                      styles.consoleLine,
                      {
                        color:
                          line.level === 'error'
                            ? colors.error
                            : line.level === 'warn'
                            ? '#f59e0b'
                            : colors.text,
                      },
                    ]}
                  >
                    {line.level === 'error' ? '✖ ' : line.level === 'warn' ? '⚠ ' : '› '}
                    {line.text}
                  </Text>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {copiedToast && (
        <View pointerEvents="none" style={[styles.toast, { backgroundColor: colors.primary }]}>
          <Ionicons name="checkmark-circle" size={16} color="#fff" />
          <Text style={styles.toastText}>{copiedToast}</Text>
        </View>
      )}

      <Modal
        visible={showExamples}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowExamples(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Misollar</Text>
              <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
                Tayyor mini-loyihalardan o'rganing
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowExamples(false)} style={styles.modalClose}>
              <Ionicons name="close" size={26} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
            contentContainerStyle={styles.filterContent}
          >
            {(['all', 'html', 'css', 'js'] as const).map((f) => {
              const active = exampleFilter === f;
              const label = f === 'all' ? 'Hammasi' : f.toUpperCase();
              return (
                <TouchableOpacity
                  key={f}
                  onPress={() => {
                    triggerHaptic('light');
                    setExampleFilter(f);
                  }}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: active ? colors.primary : colors.card,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.filterChipText, { color: active ? '#fff' : colors.text }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <ScrollView contentContainerStyle={styles.examplesList}>
            {filteredExamples.map((ex) => (
              <TouchableOpacity
                key={ex.id}
                style={[styles.exampleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => onSelectExample(ex)}
                activeOpacity={0.8}
              >
                <View style={[styles.exampleIconBox, { backgroundColor: colors.primary + '22' }]}>
                  <Ionicons name={ex.icon as keyof typeof Ionicons.glyphMap} size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.exampleTitleRow}>
                    <Text style={[styles.exampleTitle, { color: colors.text }]}>{ex.title}</Text>
                    <View style={[styles.levelChip, { backgroundColor: colors.background }]}>
                      <Text style={[styles.levelChipText, { color: colors.textSecondary }]}>{ex.level}</Text>
                    </View>
                  </View>
                  <Text style={[styles.exampleDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                    {ex.description}
                  </Text>
                  <View style={[styles.categoryChip, { backgroundColor: colors.primary + '18' }]}>
                    <Text style={[styles.categoryChipText, { color: colors.primary }]}>
                      {ex.category.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={showInfo}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInfo(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={[styles.infoIconBox, { backgroundColor: colors.primary + '22' }]}>
                <Ionicons name={TAB_META[activeTab].icon} size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{currentInfo.title}</Text>
                <Text style={[styles.modalSub, { color: colors.textSecondary }]} numberOfLines={1}>
                  {currentInfo.tagline}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowInfo(false)} style={styles.modalClose}>
              <Ionicons name="close" size={26} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.infoContent}>
            <Text style={[styles.infoSectionTitle, { color: colors.text }]}>Asosiy nuqtalar</Text>
            {currentInfo.points.map((p, i) => (
              <View key={i} style={styles.infoPoint}>
                <View style={[styles.infoDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.infoPointText, { color: colors.text }]}>{p}</Text>
              </View>
            ))}

            <Text style={[styles.infoSectionTitle, { color: colors.text, marginTop: 20 }]}>Misol</Text>
            <View style={[styles.infoCodeBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.infoCodeText, { color: colors.text }]}>{currentInfo.example}</Text>
            </View>

            <TouchableOpacity
              style={[styles.infoTryButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                triggerHaptic('light');
                setShowInfo(false);
                setShowExamples(true);
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="library-outline" size={16} color="#fff" />
              <Text style={styles.infoTryButtonText}>Misollarni ko'rish</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      <AiHelperModal
        visible={showAi}
        onClose={() => setShowAi(false)}
        html={html}
        css={css}
        js={js}
        activeLanguage={activeTab}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerSub: { fontSize: 12, marginTop: 2 },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  runAllText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  tabText: { fontSize: 12, fontWeight: 'bold' },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 14,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  roleText: { fontSize: 12, fontWeight: '500' },
  editorSection: { flex: 1, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 14, gap: 8 },
  snippetBar: { maxHeight: 40, flexGrow: 0 },
  snippetBarContent: { gap: 6, paddingVertical: 2 },
  snippetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 36,
    alignItems: 'center',
  },
  snippetText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 13,
    fontWeight: '600',
  },
  editor: {
    flex: 1.4,
    minHeight: 140,
    padding: 12,
    borderRadius: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 13,
    textAlignVertical: 'top',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'stretch',
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 8,
  },
  runButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  iconButton: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  previewBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  webview: { flex: 1, backgroundColor: 'transparent' },
  jsRunContainer: { flex: 1 },
  // 0x0 WebView Android'da ko'pincha JS'ni ishga tushirmaydi — bu console.log'ning
  // "jim qolish" muammosining asosiy sababi. 1x1 sezilmas ekranga qo'yamiz.
  jsHiddenWebView: {
    position: 'absolute',
    width: 1,
    height: 1,
    left: -10,
    top: -10,
    opacity: 0,
  },
  consoleScroll: { flex: 1 },
  consoleContent: { padding: 10, gap: 4 },
  consoleEmpty: { fontSize: 12, fontStyle: 'italic' },
  consoleLine: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 12,
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 20,
  },
  placeholderText: { fontSize: 13 },
  outputSection: { flex: 1, paddingTop: 12, paddingBottom: 14, gap: 10 },
  outputWebViewBox: {
    flex: 1,
    marginHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  outputConsole: {
    maxHeight: 140,
    marginHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  toast: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  modalContainer: { flex: 1 },
  modalHeader: {
    paddingTop: Platform.OS === 'ios' ? 16 : 20,
    paddingBottom: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    gap: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalSub: { fontSize: 12, marginTop: 2 },
  modalClose: { padding: 4 },

  filterRow: { maxHeight: 50, flexGrow: 0 },
  filterContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterChipText: { fontSize: 13, fontWeight: '600' },

  examplesList: { padding: 14, gap: 10 },
  exampleCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  exampleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  exampleTitle: { fontSize: 15, fontWeight: '700', flex: 1 },
  exampleDesc: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  levelChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelChipText: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  categoryChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  categoryChipText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: { padding: 18, gap: 8 },
  infoSectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoPoint: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  infoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  infoPointText: { fontSize: 14, flex: 1, lineHeight: 20 },
  infoCodeBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  infoCodeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 13,
    lineHeight: 20,
  },
  infoTryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 8,
  },
  infoTryButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default CodePlaygroundScreen;
