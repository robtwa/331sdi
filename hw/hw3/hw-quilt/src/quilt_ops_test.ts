import * as assert from 'assert';
import { NW, NE, SW, SE, GREEN, ROUND, Square, rnil, rcons, qnil, qcons } from './quilt';
import {sew, symmetrize, sflip_vert, rflip_vert, qflip_vert} from './quilt_ops';


describe('quilt_ops', function() {
  const nw_sq: Square = {corner: NW, color: GREEN, shape: ROUND};
  const ne_sq: Square = {corner: NE, color: GREEN, shape: ROUND};
  const se_sq: Square = {corner: SE, color: GREEN, shape: ROUND};
  const sw_sq: Square = {corner: SW, color: GREEN, shape: ROUND};

  it('sflip_vert', function() {
    assert.deepStrictEqual(sflip_vert(nw_sq), sw_sq);
    assert.deepStrictEqual(sflip_vert(sw_sq), nw_sq);

    assert.deepStrictEqual(sflip_vert(ne_sq), se_sq);
    assert.deepStrictEqual(sflip_vert(se_sq), ne_sq);

  });

  it('rflip_vert', function() {
    // 0-1-many heuristic, base case
    assert.deepStrictEqual(rflip_vert(rnil), rnil);

    // 0-1-many heuristic, 1 recursive call (only 1 possible)
    assert.deepStrictEqual(rflip_vert(rcons(sw_sq, rnil)),
      rcons(nw_sq, rnil));

    // 0-1-many heuristic, more than 1 recursive call (1st)
    assert.deepStrictEqual(rflip_vert(rcons(nw_sq, rcons(sw_sq, rnil))),
      rcons(sw_sq, rcons(nw_sq, rnil)));

    // 0-1-many heuristic, more than 1 recursive call (2nd)
    assert.deepStrictEqual(rflip_vert(rcons(nw_sq, rcons(sw_sq,rcons(nw_sq, rcons(sw_sq, rnil))))),
      rcons(sw_sq, rcons(nw_sq,rcons(sw_sq, rcons(nw_sq, rnil)))));
  });

  it('qflip_vert', function() {
    assert.deepStrictEqual(qflip_vert(qnil), qnil);

    const row1 = rcons(nw_sq, rcons(ne_sq, rnil));
    const row1exp = rcons(sw_sq, rcons(se_sq, rnil));
    const quilt1 = qcons(row1, qnil);
    const quilt1exp = qcons(row1exp, qnil);
    assert.deepStrictEqual(qflip_vert(quilt1), quilt1exp);

    const row2 = rcons(sw_sq, rcons(se_sq, rnil));
    const row2exp = rcons(nw_sq, rcons(ne_sq, rnil));
    const quilt2 = qcons(row2,qnil);
    const quilt2exp = qcons(row2exp,qnil);
    assert.deepStrictEqual(qflip_vert(quilt2), quilt2exp);

    const quilt1and2inp = qcons(row1,qcons(row2,qnil));
    const quilt1and2exp = qcons(row1exp,qcons(row2exp,qnil));
    const quilt1and2act = qflip_vert(quilt1and2inp);
    // console.log("quilt1and2exp", quilt1and2exp);
    // console.log("quilt1and2act", quilt1and2act);
    assert.deepStrictEqual(quilt1and2act, quilt1and2exp);
  });

  it('sflip_horz', function() {
    // TODO: implement
  });

  it('rflip_horz', function() {
    // TODO: implement
  });

  it('qflip_horz', function() {
    // TODO: implement
  });

  it('sew', function() {
    const r1 = rcons(nw_sq, rcons(ne_sq, rnil));
    const r12 = rcons(se_sq, rcons(sw_sq, rnil));
    const r2 = rcons(nw_sq, rcons(ne_sq, rcons(nw_sq, rcons(ne_sq, rnil))));
    const r22 = rcons(se_sq, rcons(sw_sq, rcons(se_sq, rcons(sw_sq, rnil))));

    // invalid case: (qnil, !qnil)
    assert.throws(() => sew(qnil, qcons(r1, qnil)), Error);
    assert.throws(() => sew(qnil, qcons(r1, qcons(r1, qnil))), Error);

    // invalid case: (!qnil, qnil)
    assert.throws(() => sew(qcons(r1, qnil), qnil), Error);
    assert.throws(() => sew(qcons(r1, qcons(r1, qnil)), qnil), Error);

    // 0-1-many: base case
    assert.deepStrictEqual(sew(qnil, qnil), qnil);

    // 0-1-many: one recursive call
    assert.deepStrictEqual(sew(qcons(r1, qnil), qcons(r1, qnil)), qcons(r2, qnil));
    assert.deepStrictEqual(sew(qcons(r12, qnil), qcons(r12, qnil)), qcons(r22, qnil));

    // 0-1-many: many recursive calls
    assert.deepStrictEqual(
        sew(qcons(r1, qcons(r1, qnil)), qcons(r1, qcons(r1, qnil))),
        qcons(r2, qcons(r2, qnil)));
    assert.deepStrictEqual(
        sew(qcons(r12, qcons(r12, qcons(r12, qnil))), 
            qcons(r12, qcons(r12, qcons(r12, qnil)))),
        qcons(r22, qcons(r22, qcons(r22, qnil))));
  });

  it('symmetrize', function() {
    // 0-1-many: base case
    assert.deepStrictEqual(symmetrize(qnil), qnil);
    assert.deepStrictEqual(symmetrize(qcons(rcons(nw_sq, rnil), qnil)),
        qcons(rcons(nw_sq, rcons(ne_sq, rnil)),
            qcons(rcons(sw_sq, rcons(se_sq, rnil)), qnil)));

    // 0-1-many: one recursive call
    assert.deepStrictEqual(symmetrize(qcons(rcons(nw_sq, rnil), qnil)),
        qcons(rcons(nw_sq, rcons(ne_sq, rnil)),
            qcons(rcons(sw_sq, rcons(se_sq, rnil)), qnil)));
    assert.deepStrictEqual(symmetrize(qcons(rcons(se_sq, rnil), qnil)),
        qcons(rcons(se_sq, rcons(sw_sq, rnil)),
            qcons(rcons(ne_sq, rcons(nw_sq, rnil)), qnil)));

    // 0-1-many: many recursive calls
    const r1 = rcons(nw_sq, rcons(ne_sq, rnil));
    assert.deepStrictEqual(symmetrize(qcons(r1, qnil)),
        qcons(
            rcons(nw_sq, rcons(ne_sq, rcons(nw_sq, rcons(ne_sq, rnil)))),
            qcons(
                rcons(sw_sq, rcons(se_sq, rcons(sw_sq, rcons(se_sq, rnil)))),
                qnil)));
    const r2 = rcons(sw_sq, rcons(se_sq, rnil));
    assert.deepStrictEqual(symmetrize(qcons(r1, qcons(r2, qnil))),
        qcons(
            rcons(nw_sq, rcons(ne_sq, rcons(nw_sq, rcons(ne_sq, rnil)))),
            qcons(
                rcons(sw_sq, rcons(se_sq, rcons(sw_sq, rcons(se_sq, rnil)))),
                qcons(
                    rcons(nw_sq, rcons(ne_sq, rcons(nw_sq, rcons(ne_sq, rnil)))),
                    qcons(
                        rcons(sw_sq, rcons(se_sq, rcons(sw_sq, rcons(se_sq, rnil)))),
                        qnil)))));
  });

});
