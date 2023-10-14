import * as assert from 'assert';
import { NW, NE, SW, SE, GREEN, ROUND, Square, rnil, rcons, qnil, qcons } from './quilt';
import { sew, symmetrize } from './quilt_ops';


describe('quilt_ops', function() {

  it('sflip_vert', function() {
    // TODO: implement
  });

  it('rflip_vert', function() {
    // TODO: implement
  });

  it('qflip_vert', function() {
    // TODO: implement
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

  const nw_sq: Square = {corner: NW, color: GREEN, shape: ROUND};
  const ne_sq: Square = {corner: NE, color: GREEN, shape: ROUND};
  const se_sq: Square = {corner: SE, color: GREEN, shape: ROUND};
  const sw_sq: Square = {corner: SW, color: GREEN, shape: ROUND};

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
