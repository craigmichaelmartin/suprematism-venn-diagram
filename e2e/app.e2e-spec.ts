import { SuprematismVennDiagramPage } from './app.po';

describe('suprematism-venn-diagram App', () => {
  let page: SuprematismVennDiagramPage;

  beforeEach(() => {
    page = new SuprematismVennDiagramPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
