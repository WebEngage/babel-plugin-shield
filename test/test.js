const expect = require('chai').expect;
const babel = require('babel-core');
const shield = require.resolve('../dist/index.js');

describe('babel-plugin-shield', function () {
  it('testing "this" scope', function () {

  const code = `
      var testObj = {
          dummyFunc: function () {
              return { b : 2 };
          },
          testShieldFunc:function(){
              console.log(shield_(this.dummyFunc().b));
          }
      }
      testObj.testShieldFunc();
  `

  const runLogs = compileAndRun(code)
    expect(runLogs[0]).to.be.eq(2);
  });

  it('testing deep nested objects', function () {

  const code = `

      var testing = {
        parent : {
          child : function(){
            return { val : 1}
          }
        }
      }
      var testObj = {
          testShieldFunc:function(){
              console.log(shield_(testing.parent.child().val));
          }
      }
      testObj.testShieldFunc();
  `

  const runLogs = compileAndRun(code)
    expect(runLogs[0]).to.be.eq(1);
  });

  it('testing for safe undefined', function () {

  const code = `

      var testing = {
        parent : {
          child : function(){
            return { val : 1}
          }
        }
      }
      var testObj = {
          testShieldFunc:function(){
              console.log(shield_(testing.parent2.child().val));
          }
      }
      testObj.testShieldFunc();
  `

  const runLogs = compileAndRun(code)
    expect(runLogs[0]).to.be.eq(undefined);
  });

});

function compileAndRun (code) {
  const output = babel.transform(code, {
    plugins: [ shield ],
    presets: ['es2015']
  })

  const logs = [];
  const console = {
    log: (val) => logs.push(val)
  };
  eval(output.code)
  return logs;
}