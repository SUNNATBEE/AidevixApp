import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const CodePlaygroundScreen = () => {
  const { colors, spacing } = useTheme();
  const [html, setHtml] = useState('<h1>Salom Aidevix!</h1>\n<p>Bu yerda kod yozib natijasini ko\'rishingiz mumkin.</p>');
  const [css, setCss] = useState('body { background: #0f172a; color: white; font-family: sans-serif; padding: 20px; } \nh1 { color: #6366f1; }');
  const [js, setJs] = useState('console.log("Aidevix Playground ishga tushdi!");');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'output'>('html');

  const combinedOutput = `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>
  `;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Code Playground</Text>
        <TouchableOpacity style={[styles.runButton, { backgroundColor: colors.primary }]} onPress={() => setActiveTab('output')}>
          <Ionicons name="play" size={18} color="#fff" />
          <Text style={styles.runButtonText}>Run</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {(['html', 'css', 'js', 'output'] as const).map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab, 
              activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
            ]}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === tab ? colors.primary : colors.textSecondary }
            ]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeTab === 'html' && (
          <TextInput
            multiline
            style={[styles.editor, { color: colors.text, backgroundColor: colors.card }]}
            value={html}
            onChangeText={setHtml}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
        {activeTab === 'css' && (
          <TextInput
            multiline
            style={[styles.editor, { color: colors.text, backgroundColor: colors.card }]}
            value={css}
            onChangeText={setCss}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
        {activeTab === 'js' && (
          <TextInput
            multiline
            style={[styles.editor, { color: colors.text, backgroundColor: colors.card }]}
            value={js}
            onChangeText={setJs}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
        {activeTab === 'output' && (
          <WebView
            originWhitelist={['*']}
            source={{ html: combinedOutput }}
            style={styles.webview}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  runButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  editor: {
    flex: 1,
    padding: 15,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 14,
    textAlignVertical: 'top',
  },
  webview: {
    flex: 1,
  },
});

export default CodePlaygroundScreen;
