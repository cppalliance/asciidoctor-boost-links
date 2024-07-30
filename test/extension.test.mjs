/*
    Copyright (c) 2024 Alan de Freitas (alandefreitas@gmail.com)

    Distributed under the Boost Software License, Version 1.0. (See accompanying
    file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

    Official repository: https://github.com/alandefreitas/antora-cpp-tagfiles-extension
*/


import test, {describe, it} from "node:test"
import {ok, strictEqual} from "node:assert"

import fs from 'fs'
import BoostLinksExtension from '../lib/extension.js'
import {fileURLToPath} from 'url';
import path from 'path';
import Asciidoctor from 'asciidoctor'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('The extension produces links to Boost libraries', () => {
    // ============================================================
    // Load fixtures.json
    // ============================================================
    const fileContent = fs.readFileSync(path.join(__dirname, "fixtures.json"), 'utf8')
    const fixtures = JSON.parse(fileContent)

    // ============================================================
    // Iterate fixtures and run tests
    // ============================================================
    for (const {name, tests} of fixtures) {
        test(name, () => {
            for (const {input, output, attributes} of tests) {
                const attr = attributes ? attributes : {}
                const result = BoostLinksExtension.generateBoostLink(input, attr)
                const error_message = `Input: ${input}\nExpected Output: ${output}\nGot: ${result}`
                strictEqual(result, output, error_message)
            }
        })
    }
});

describe('The extension can be registered with Asciidoc', () => {
    const processor = Asciidoctor()
    processor.Extensions.register(BoostLinksExtension)
    const result = processor.convert(`boost:core[]`)
    // Check if result contains link to boost.core
    ok(result.includes('https://www.boost.org/libs/core'), 'The extension should produce a link to boost.core\nWe got the following result:\n' + result)
    ok(result.includes('Boost.Core'), 'The extension should produce a link to boost.core\nWe got the following result:\n' + result)
})
