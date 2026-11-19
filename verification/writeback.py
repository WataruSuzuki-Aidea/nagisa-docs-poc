"""Claude Docs から書き出した Markdown のうち、文章を直した行だけを元の Markdown に反映する。
表の中の改行・画像・リンクなど、Claude Docs を通ると形が変わる記述は、比較の前にそろえて差分から除く。"""
import difflib, re, sys

def normalize(text: str) -> list[str]:
    text = re.sub(r'\\\n', '<br>', text)              # hardBreak（\ と改行）→ <br>
    text = text.replace('\\<br>', '<br>')              # エスケープされた <br>
    text = re.sub(r'!\[([^\]]*)\]\([^)]*\)', r'画像：\1', text)   # 画像 → 「画像：代替テキスト」
    text = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', text)          # リンク → 文字だけ
    return text.split('\n')

original_path, exported_path = sys.argv[1], sys.argv[2]
original = open(original_path, encoding='utf-8').read().lstrip('\n').split('\n')
exported_norm = normalize(open(exported_path, encoding='utf-8').read())
original_norm = normalize('\n'.join(original))
assert len(original_norm) == len(original)

result, changes = [], 0
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(a=original_norm, b=exported_norm, autojunk=False).get_opcodes():
    if tag == 'equal':
        result += original[i1:i2]          # 変えていない行は、元の記述（画像・リンク・<br>）を残す
    else:
        changes += 1
        print(f'--- 反映する変更 {changes}（{tag}）')
        for line in original[i1:i2]: print('  - ' + line)
        for line in exported_norm[j1:j2]: print('  + ' + line)
        result += exported_norm[j1:j2]
open(original_path.replace('.md', '.writeback.md'), 'w', encoding='utf-8').write('\n'.join(result))
