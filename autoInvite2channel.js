'use strict';
const puppeteer = require('puppeteer');

(async () => {

  console.log("==================================================");
  console.log("");
  console.log("        Mattermostユーザ自動招待プログラム");
  console.log("");
  console.log("==================================================");
  console.log("");
  console.log("[ 書式 ]");
  console.log("");
  console.log("> node autoInvite2channel.js \"Mattermost_Site_URL\" \"Mattermost_LoginID\" \"Mattermost_LoginPassword\" \"Channel_URL\" \"UserID_1 UserID_2 UserID_3 ...\"");
  console.log("");
  if ( process.argv.length !== 7 ) { process.exit(); }
  
  // ------------------------------------------------------------
  // MattermostのSiteURL
  const site_url = process.argv[2];             // サイトURL

  // 認証情報
  const mattermost_id       = process.argv[3];  // ユーザ名
  const mattermost_password = process.argv[4];  // パスワード

  // 招待先のチャネル
  const channel_url = process.argv[5];          // チャネルURL

  // 招待対象のユーザリスト
  const user_id_list = process.argv[6];         // ユーザIDリスト
  const user_id = user_id_list.split(/\s/);     // ユーザID配列

  // ------------------------------------------------------------
  // ブラウザの起動
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 20,
  })
  const page = await browser.newPage();

  // ------------------------------------------------------------
  // Mattermostにアクセス
  await page.goto(site_url+'/login');

  // Where would you like to view this? をスキップ
  await page.waitForSelector('div[id="root"]', {timeout: 30000});
  await page.goto(site_url+'/login');

  // ログイン処理
  const dom_login_id = 'input[id="input_loginId"]';
  await page.waitForSelector(dom_login_id, {timeout: 30000});
  await page.type(dom_login_id, mattermost_id);

  const dom_login_password = 'input[id="input_password-input"]';
  await page.waitForSelector(dom_login_password, {timeout: 30000});
  await page.type(dom_login_password, mattermost_password);

  await page.keyboard.press('Enter');
  await page.waitForSelector('div[id="channel-header"]', {timeout: 30000});

  // ------------------------------------------------------------
  // 招待先のチャネルに移動
  await page.goto(channel_url);
  await page.waitForSelector('div[id="channel-header"]', {timeout: 30000});

  // 招待ウィンドウを開く
  const dom_add_icon = 'i[title="Add Icon"]';
  await page.click('button[id="member_rhs"]');  // メンバーを開く
  await page.click(dom_add_icon);               // 追加をクリック

  // 招待対象のユーザID分だけループ処理
  for ( var i = 0; i < user_id.length; i++ ) {

    // 招待ウィンドウを開く
    await page.waitForSelector(dom_add_icon, {timeout: 3000});
    await page.click(dom_add_icon);                   // 追加をクリック

    // 招待処理
    const dom_input_area = 'div[id="selectItems"]';
    await page.waitForSelector(dom_input_area, {timeout: 1000});
    await page.click(dom_input_area);                 // 入力欄をクリック
    await page.type(dom_input_area, user_id[i]);      // 招待対象者のIDを入力

    try {
      const dom_list_area = 'div[id="multiSelectList"]';
      await page.waitForSelector(dom_list_area, {timeout: 1000});
      await page.click(dom_list_area);                // 候補をクリック
      await page.click('button[type="submit"]');      // 追加をクリック

    } catch (e) {
      await page.keyboard.down('Control');            // Controlキーを押す
      await page.keyboard.press('KeyA');              // Aキーを押す（Ctrl+A）
      await page.keyboard.press('KeyX');              // Xキーを押す（Ctrl+X）
      await page.keyboard.up('Control');              // Controlキーを離す
    }
  }

  // 終了
  await browser.close();
  
})();