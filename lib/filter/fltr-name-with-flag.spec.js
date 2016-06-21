describe("leadingZero", function () {
    beforeEach(module("trialsTrackmap"))

    var $filter,
        filterName = "nameWithFlag"

    beforeEach(inject(function(_$filter_){
        $filter = _$filter_
    }))

    it("exists", function() {
        expect($filter(filterName)).not.toBeNull()
    })

    describe("test filter", function () {
        it("should handle correct", function(){
            expect($filter(filterName)()).toBe("")
            expect($filter(filterName)(undefined)).toBe("")
            expect($filter(filterName)([])).toBe("")
            expect($filter(filterName)({})).toBe("")
            expect($filter(filterName)("")).toBe("")
        })

        it("should be correct", function () {
            var name
            name = $filter(filterName)("dutscher-DE")
            expect(name).toContain("lang_de")
            name = $filter(filterName)("ITGE-Power")
            expect(name).toContain("lang_it")
            expect(name).toContain("lang_de")
            name = $filter(filterName)("FR-KarTanK")
            expect(name).toContain("lang_fr")
            name = $filter(filterName)("NOR-SlongBlong")
            expect(name).toContain("lang_no")
            name = $filter(filterName)("UK_AlexBurnzee")
            expect(name).toContain("lang_en")
            name = $filter(filterName)("SWE-Abylons-TFG")
            expect(name).toContain("lang_se")
            name = $filter(filterName)("EG-Khaled-TFG")
            expect(name).toContain("lang_eg")
            name = $filter(filterName)("IT-DanielP")
            expect(name).toContain("lang_it")
            name = $filter(filterName)("CRO-Boogie-TFG")
            expect(name).toContain("lang_hr")
            name = $filter(filterName)("CZE-VaNa91")
            expect(name).toContain("lang_cz")
            name = $filter(filterName)("GTDave")
            expect(name).toContain("GTDave")
        })
    })
})