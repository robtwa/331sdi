import * as assert from 'assert';
import { NW, NE, SW, SE, GREEN, ROUND, Square, rnil, rcons, qnil, qcons } from './quilt';
import {
  sew,
  symmetrize,
  sflip_vert,
  rflip_vert,
  qflip_vert,
  sflip_horz,
  rflip_horz,
  qflip_horz,
} from './quilt_ops';


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
    // 0-1-many heuristic, base case
    assert.deepStrictEqual(qflip_vert(qnil), qnil);

    // 0-1-many heuristic, 1 recursive call (1st)
    const row1 = rcons(nw_sq, rcons(ne_sq, rnil));
    const row1exp = rcons(sw_sq, rcons(se_sq, rnil));
    const quilt1 = qcons(row1, qnil);
    const quilt1exp = qcons(row1exp, qnil);
    assert.deepStrictEqual(qflip_vert(quilt1), quilt1exp);

    // 0-1-many heuristic, 1 recursive call (2nd)
    const row2 = rcons(sw_sq, rcons(se_sq, rnil));
    const row2exp = rcons(nw_sq, rcons(ne_sq, rnil));
    const quilt2 = qcons(row2,qnil);
    const quilt2exp = qcons(row2exp,qnil);
    assert.deepStrictEqual(qflip_vert(quilt2), quilt2exp);

    // 0-1-many heuristic, more than 1 recursive call
    const quilt1and2inp = qcons(row1,qcons(row2,qnil));
    const quilt1and2exp = qcons(row2exp,qcons(row1exp,qnil));
    const quilt1and2act = qflip_vert(quilt1and2inp);
    assert.deepStrictEqual(quilt1and2act, quilt1and2exp);
  });

  it('sflip_horz', function() {
    assert.deepStrictEqual(sflip_horz(nw_sq), ne_sq);
    assert.deepStrictEqual(sflip_horz(sw_sq), se_sq);
    assert.deepStrictEqual(sflip_horz(ne_sq), nw_sq);
    assert.deepStrictEqual(sflip_horz(se_sq), sw_sq);
  });

  it('rflip_horz', function() {
    // "0-1-many" heuristic, base case
    assert.deepStrictEqual(rflip_horz(rnil), rnil);

    // "0-1-many" heuristic, 1 recursive call (1st)
    const row1Original = rcons(nw_sq, rcons(sw_sq, rnil));
    const row1Expected = rcons(se_sq, rcons(ne_sq, rnil));
    assert.deepStrictEqual(rflip_horz(row1Original), row1Expected);

    // "0-1-many" heuristic, 1 recursive call (2nd)
    const row2Original = rcons(ne_sq, rcons(se_sq, rnil));
    const row2Expected = rcons(sw_sq, rcons(nw_sq, rnil));
    assert.deepStrictEqual(rflip_horz(row2Original), row2Expected);

    // "0-1-many" heuristic, more than 1 recursive call (1st)
    const row3org = rcons(nw_sq, rcons(sw_sq, rcons(ne_sq, rcons(se_sq, rnil))));
    const row3exp = rcons(sw_sq, rcons(nw_sq, rcons(se_sq, rcons(ne_sq, rnil))));
    assert.deepStrictEqual(rflip_horz(row3org), row3exp);

    // "0-1-many" heuristic, more than 1 recursive call (2nd)
    const row4org = rcons(se_sq, rcons(ne_sq, rcons(sw_sq, rcons(nw_sq, rnil))));
    const row4exp = rcons(ne_sq, rcons(se_sq, rcons(nw_sq, rcons(sw_sq, rnil))));
    assert.deepStrictEqual(rflip_horz(row4org), row4exp);

  });

  it('qflip_horz', function() {
    // "0-1-many" heuristic, base case
    assert.deepStrictEqual(qflip_horz(qnil), qnil);

    // "0-1-many" heuristic, 1 recursive call (1st)
    const row1Original = rcons(nw_sq, rcons(sw_sq, rnil));
    const row1Expected = rcons(se_sq, rcons(ne_sq, rnil));
    const quilt1org = qcons(row1Original, qnil);
    const quilt1exp = qcons(row1Expected, qnil);
    assert.deepStrictEqual(qflip_horz(quilt1org), quilt1exp);

    // "0-1-many" heuristic, 1 recursive call (2nd)
    const row2Original = rcons(ne_sq, rcons(se_sq, rnil));
    const row2Expected = rcons(sw_sq, rcons(nw_sq, rnil));
    const quilt2org = qcons(row2Original, qnil);
    const quilt2exp = qcons(row2Expected, qnil);
    assert.deepStrictEqual(qflip_horz(quilt2org), quilt2exp);

    // "0-1-many" heuristic, more than 1 recursive call (1st)
    const quilt3org = qcons(row1Original, qcons(row2Original, qnil));
    const quilt3exp = qcons(row1Expected, qcons(row2Expected, qnil));
    assert.deepStrictEqual(qflip_horz(quilt3org), quilt3exp);

    // "0-1-many" heuristic, more than 1 recursive call (2nd)
    const quilt4org = qcons(row1Original, qcons(row2Original,
      qcons(row1Original, qcons(row2Original, qnil))));
    const quilt4exp = qcons(row1Expected, qcons(row2Expected,
      qcons(row1Expected, qcons(row2Expected, qnil))));
    assert.deepStrictEqual(qflip_horz(quilt4org), quilt4exp);

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
