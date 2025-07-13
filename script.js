// HTMLプレビュー機能
const htmlInput = document.getElementById('htmlInput');
const htmlPreview = document.getElementById('htmlPreview');
if (htmlInput && htmlPreview) {
    htmlInput.addEventListener('input', () => {
        const value = htmlInput.value;
        // 各タグごとに開始タグと終了タグの数が一致するかチェック
        const tagPattern = /<([a-zA-Z0-9]+)[^>]*>/g;
        let match;
        let tagCounts = {};
        while ((match = tagPattern.exec(value)) !== null) {
            const tag = match[1];
            tagCounts[tag] = tagCounts[tag] ? tagCounts[tag] + 1 : 1;
        }
        const endTagPattern = /<\/([a-zA-Z0-9]+)\s*>/g;
        let endMatch;
        let endTagCounts = {};
        while ((endMatch = endTagPattern.exec(value)) !== null) {
            const tag = endMatch[1];
            endTagCounts[tag] = endTagCounts[tag] ? endTagCounts[tag] + 1 : 1;
        }
        let errorTag = null;
        for (const tag in tagCounts) {
            if (tagCounts[tag] !== (endTagCounts[tag] || 0)) {
                errorTag = tag;
                break;
            }
        }
        if (errorTag) {
            htmlPreview.innerHTML = `<span style=\"color:red;\">エラー: &lt;${errorTag}&gt; の開始タグと終了タグの数が一致していません。</span>`;
            return;
        }
        htmlPreview.innerHTML = value;
        htmlPreview.style.color = '#222';
        // プレビュー内のh1〜h6に直接font-sizeをセット
        htmlPreview.querySelectorAll('h1').forEach(el => el.style.fontSize = '2rem');
        htmlPreview.querySelectorAll('h2').forEach(el => el.style.fontSize = '1.5rem');
        htmlPreview.querySelectorAll('h3').forEach(el => el.style.fontSize = '1.17rem');
        htmlPreview.querySelectorAll('h4').forEach(el => el.style.fontSize = '1rem');
        htmlPreview.querySelectorAll('h5').forEach(el => el.style.fontSize = '0.83rem');
        htmlPreview.querySelectorAll('h6').forEach(el => el.style.fontSize = '0.67rem');
    });
    // 初期表示
    htmlPreview.innerHTML = htmlInput.value;
    htmlPreview.style.color = '#222';
}

// CSSプレビュー機能
const cssInput = document.getElementById('cssInput');
const cssPreview = document.getElementById('cssPreview');
if (cssInput && cssPreview) {
    function applyCSS() {
        // 既存のstyleタグを削除
        let oldStyle = document.getElementById('dynamicCSS');
        if (oldStyle) oldStyle.remove();
        // 新しいstyleタグを作成
        const style = document.createElement('style');
        style.id = 'dynamicCSS';
        let css = cssInput.value;
        // セレクタ部分を抽出し、#cssPreview セレクタ, #cssPreview > セレクタ のように複数指定
        css = css.replace(/([^{\s][^{]*?)\s*{/g, function(match, sel) {
            sel = sel.trim();
            if (!sel.startsWith('#cssPreview')) {
                return sel.split(',').map(s => `#cssPreview ${s.trim()}, #cssPreview > ${s.trim()}`).join(', ') + ' {';
            } else {
                return match;
            }
        });
        // 各プロパティ末尾に!importantを付与
        css = css.replace(/([^;{}]+:[^;{}]+)(;?)/g, function(match, prop, semi) {
            if (/!important/.test(prop)) return match;
            return prop.trim() + ' !important' + (semi || '');
        });
        style.innerHTML = css;
        document.head.appendChild(style);
    }
    cssInput.addEventListener('input', applyCSS);
    applyCSS();
}

// JavaScript実行機能
function runJavaScript() {
    const jsInput = document.getElementById('jsInput');
    const jsOutput = document.getElementById('jsOutput');
    if (jsInput && jsOutput) {
        try {
            // 出力をキャプチャするためにconsole.logを一時的に上書き
            let output = '';
            const originalLog = console.log;
            console.log = function(msg) {
                output += msg + '\n';
                originalLog.apply(console, arguments);
            };
            // 入力されたコードを実行
            eval(jsInput.value);
            jsOutput.textContent = output;
            console.log = originalLog;
        } catch (e) {
            jsOutput.textContent = 'エラー: ' + e.message;
        }
    }
}

// 文字を変更するサンプル用関数
function changeText() {
    const p = document.getElementById('changeableText');
    if (p) {
        p.textContent = '文字が変更されました！';
    }
}

// 練習問題の答えチェック
function checkAnswer(level) {
    let answer, correct, message;
    if (level === 1) {
        answer = document.getElementById('answer1').value.trim();
        correct = /<h1>.*<\/h1>/i.test(answer);
        message = correct ? '正解です！' : 'ヒント: <h1>タグを使いましょう。';
        alert(message);
    } else if (level === 2) {
        answer = document.getElementById('answer2').value.trim();
        correct = /color\s*:\s*red/i.test(answer) && /text-align\s*:\s*center/i.test(answer);
        message = correct ? '正解です！' : 'ヒント: colorとtext-alignを使いましょう。';
        alert(message);
    } else if (level === 3) {
        answer = document.getElementById('answer3').value.trim();
        correct = /alert\s*\(.*こんにちは.*\)/i.test(answer);
        message = correct ? '正解です！' : 'ヒント: alert("こんにちは！"); のように書きましょう。';
        alert(message);
    }
}

// cssPreview内のh1〜h6タグのfont-sizeをrem単位で詳細度最大で指定
(function() {
    let resetStyle = document.getElementById('cssPreviewReset');
    if (resetStyle) resetStyle.remove();
    resetStyle = document.createElement('style');
    resetStyle.id = 'cssPreviewReset';
    resetStyle.innerHTML = `
        html body #cssPreview h1 { font-size: 2rem !important; }
        html body #cssPreview h2 { font-size: 1.5rem !important; }
        html body #cssPreview h3 { font-size: 1.17rem !important; }
        html body #cssPreview h4 { font-size: 1rem !important; }
        html body #cssPreview h5 { font-size: 0.83rem !important; }
        html body #cssPreview h6 { font-size: 0.67rem !important; }
    `;
    document.head.appendChild(resetStyle);
})(); 