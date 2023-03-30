// 获取类名
function getClassName() {
    value = document.getElementById("id_class_name").value;
    if (value.length == 0) {
        alert("请输入类名!!");
        return null;
    }
    return value;
}


// 转换
function trans() {
    if (getClassName() == null) return;
    clsName = getClassName();
    text = document.getElementById("raw_json").value;
    if (text.length == 0) return;
    obj = JSON.parse(text.replace(/\/\/.*/g,''));
    if (obj == null || obj == undefined || obj == false) {
        alert("json 字符串不正确 请检查");
        return;
    }
    
    // 循环 属性
    pStr = "";
    thisStr = "";
    toObj = "";
    toJson = "";
    Object.keys(obj).forEach(key => {
        propsStr = '';
        _pSPeix = 'String';
        if ((typeof eval("obj."+key)) === 'number') {     // 数字型
            _pSPeix = 'double';
            propsStr = _pSPeix +' ' + key + ';';
        } else if (typeof eval("obj."+key) === 'string') {     // 字符串
            _pSPeix = 'String';
            propsStr = _pSPeix + ' ' + key + ';';
        } else propsStr = _pSPeix + ' ' + key + ';';
        pStr += `
            @JsonKey(name: '${key}')
            ${propsStr}
        `
        thisStr += 'this.'+key+',';
        toObj += `
            json['${key}'] as ${_pSPeix},
        `
        toJson += `
            "${key}" : instance.${key},
        `
    });
    model = `
        import 'package:json_annotation/json_annotation.dart';
        part './${clsName}.g.dart';

        @JsonSerializable()
        class ${clsName} extends Object {
            ${pStr}
            ${clsName}(${thisStr});
            factory ${clsName}.fromJson(Map<String, dynamic> srcJson) => _$${clsName}FromJson(srcJson);
            Map<String, dynamic> toJson() => _$${clsName}ToJson(this);
        }
    `
    model_g = `
        // GENERATED CODE - DO NOT MODIFY BY HAND

        part of '${clsName}.dart';
        
        // **************************************************************************
        // JsonSerializableGenerator
        // **************************************************************************
        
        ${clsName} _$${clsName}FromJson(Map<String, dynamic> json) => ${clsName}(
            ${toObj}
        );
        
        Map<String, dynamic> _$${clsName}ToJson(${clsName} instance) => <String, dynamic>{
            ${toJson}
        };    
    `;
    document.getElementById("id_model").value = model;
    document.getElementById("id_model_g").value = model_g;
}